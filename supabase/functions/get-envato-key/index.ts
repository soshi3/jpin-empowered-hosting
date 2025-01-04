import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
      status: 204,
    })
  }

  try {
    const ENVATO_API_KEY = Deno.env.get('ENVATO_API_KEY')
    if (!ENVATO_API_KEY) {
      console.error('ENVATO_API_KEY is not set')
      throw new Error('ENVATO_API_KEY is not configured')
    }

    return new Response(
      JSON.stringify({ ENVATO_API_KEY }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in get-envato-key function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    )
  }
})