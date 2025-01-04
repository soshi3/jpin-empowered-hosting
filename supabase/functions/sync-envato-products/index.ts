import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting Envato products sync...');
    const ENVATO_API_KEY = Deno.env.get('ENVATO_API_KEY');
    if (!ENVATO_API_KEY) {
      throw new Error('ENVATO_API_KEY is not set');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch products from Envato API
    const response = await fetch('https://api.envato.com/v1/discovery/search/search/item', {
      headers: {
        'Authorization': `Bearer ${ENVATO_API_KEY}`,
        'Accept': 'application/json',
      },
      method: 'GET',
      body: JSON.stringify({
        site: 'codecanyon.net',
        page_size: 100,
      }),
    });

    if (!response.ok) {
      throw new Error(`Envato API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Retrieved ${data.matches?.length || 0} products from Envato`);

    // Process and insert products
    for (const item of data.matches || []) {
      const { data: detailedItem, error: detailError } = await fetch(
        `https://api.envato.com/v3/market/catalog/item?id=${item.id}`,
        {
          headers: {
            'Authorization': `Bearer ${ENVATO_API_KEY}`,
            'Accept': 'application/json',
          },
        }
      ).then(res => res.json());

      if (detailError) {
        console.error(`Error fetching details for item ${item.id}:`, detailError);
        continue;
      }

      const productData = {
        id: String(item.id),
        envato_id: item.id,
        title: item.name,
        description: item.description,
        price: Math.round(item.price_cents / 100),
        image: detailedItem?.previews?.landscape_preview?.landscape_url || item.preview_url,
        category: item.classification,
        tags: item.tags,
        author: item.author_username,
        sales: item.number_of_sales,
        rating: item.rating,
      };

      const { error: upsertError } = await supabase
        .from('products')
        .upsert(productData, {
          onConflict: 'envato_id',
        });

      if (upsertError) {
        console.error(`Error upserting product ${item.id}:`, upsertError);
      } else {
        console.log(`Successfully synced product ${item.id}`);
      }
    }

    return new Response(
      JSON.stringify({ message: 'Products sync completed successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in sync-envato-products function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})