import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const searchQuery = url.searchParams.get('search_query') || 'wordpress'
    const page = parseInt(url.searchParams.get('page') || '1')
    
    const ENVATO_API_KEY = Deno.env.get('ENVATO_API_KEY')
    if (!ENVATO_API_KEY) {
      throw new Error('ENVATO_API_KEY is not configured')
    }

    console.log(`Fetching Envato items for query: ${searchQuery}, page: ${page}`)

    const response = await fetch(
      `https://api.envato.com/v1/discovery/search/search/item?term=${encodeURIComponent(searchQuery)}&page=${page}`,
      {
        headers: {
          'Authorization': `Bearer ${ENVATO_API_KEY}`,
        },
      }
    )

    if (!response.ok) {
      console.error('Envato API error:', await response.text())
      throw new Error(`Envato API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('Envato API response:', data)

    return new Response(
      JSON.stringify(data),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('Error in get-envato-items function:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})