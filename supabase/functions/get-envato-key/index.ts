import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const ENVATO_API_KEY = Deno.env.get('ENVATO_API_KEY')
    console.log('Retrieved ENVATO_API_KEY:', ENVATO_API_KEY ? `Present (length: ${ENVATO_API_KEY.length})` : 'Missing')
    
    if (!ENVATO_API_KEY) {
      console.error('Envato API key not found in environment variables')
      return new Response(
        JSON.stringify({ 
          error: 'Envato API key not configured',
          details: 'Please set the ENVATO_API_KEY in Supabase Edge Function secrets'
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Log the first and last 4 characters of the API key for debugging
    console.log('API Key format check:', {
      firstFourChars: ENVATO_API_KEY.substring(0, 4),
      lastFourChars: ENVATO_API_KEY.substring(ENVATO_API_KEY.length - 4),
      length: ENVATO_API_KEY.length
    })

    return new Response(
      JSON.stringify({ ENVATO_API_KEY }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      },
    )
  } catch (error) {
    console.error('Error in get-envato-key function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      },
    )
  }
})