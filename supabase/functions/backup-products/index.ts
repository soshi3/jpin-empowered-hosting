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
    console.log('Starting products backup...');
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get current timestamp for backup
    const timestamp = new Date().toISOString().split('T')[0]
    const backupTableName = `products_backup_${timestamp}`

    // Create backup table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${backupTableName} AS 
      SELECT * FROM products;
    `

    const { error: backupError } = await supabase
      .from('products')
      .select('*')
      .then(async (response) => {
        if (response.error) throw response.error
        
        // Execute backup query
        const { error } = await supabase.rpc('exec_sql', {
          query: createTableQuery
        })
        return { error }
      })

    if (backupError) {
      throw backupError
    }

    // Clean up old backups (keep only last 7 days)
    const cleanupQuery = `
      DO $$
      DECLARE
        table_name text;
      BEGIN
        FOR table_name IN (
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_name LIKE 'products_backup_%'
          ORDER BY table_name DESC
          OFFSET 7
        )
        LOOP
          EXECUTE 'DROP TABLE IF EXISTS ' || table_name;
        END LOOP;
      END $$;
    `

    const { error: cleanupError } = await supabase.rpc('exec_sql', {
      query: cleanupQuery
    })

    if (cleanupError) {
      console.error('Error cleaning up old backups:', cleanupError)
    }

    return new Response(
      JSON.stringify({ 
        message: `Products backup completed successfully to ${backupTableName}`,
        timestamp: timestamp
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in backup-products function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
