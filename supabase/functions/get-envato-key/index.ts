import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('get-envato-key function invoked')

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request')
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    })
  }

  try {
    const ENVATO_API_KEY = Deno.env.get('ENVATO_API_KEY')
    console.log('Retrieved ENVATO_API_KEY:', ENVATO_API_KEY ? 'Present' : 'Missing')
    
    if (!ENVATO_API_KEY) {
      console.error('Envato API key not found in environment variables')
      throw new Error('Envato API key not configured')
    }

    return new Response(
      JSON.stringify({ 
        ENVATO_API_KEY,
        status: 'success'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 200 
      },
    )
  } catch (error) {
    console.error('Error in get-envato-key function:', error.message)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: 'error'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 400
      },
    )
  }
})