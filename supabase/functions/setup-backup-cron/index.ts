import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Setup cron job to run daily at midnight UTC
    const setupCronQuery = `
      SELECT cron.schedule(
        'daily-products-backup',
        '0 0 * * *',
        $$
        SELECT
          net.http_post(
            url:='${Deno.env.get('SUPABASE_URL')}/functions/v1/backup-products',
            headers:='{"Content-Type": "application/json", "Authorization": "Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}"}'::jsonb
          ) as request_id;
        $$
      );
    `

    const { error } = await supabase.rpc('exec_sql', {
      query: setupCronQuery
    })

    if (error) throw error

    return new Response(
      JSON.stringify({ message: 'Backup cron job setup successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error setting up backup cron job:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})