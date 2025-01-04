import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';

interface EnvatoItem {
  id: number;
  name: string;
  description: string;
  price_cents: number;
  author_username: string;
  preview_url: string;
  thumbnail_url: string;
  live_preview_url: string;
}

interface EnvatoResponse {
  matches: EnvatoItem[];
}

export const fetchEnvatoItems = async (searchTerm: string = 'wordpress') => {
  console.log('Fetching Envato items with search term:', searchTerm);
  try {
    console.log('Invoking get-envato-key function...');
    const { data: secretData, error: secretError } = await supabase.functions.invoke('get-envato-key');
    
    if (secretError) {
      console.error('Error invoking get-envato-key function:', secretError);
      throw new Error('Envato APIキーの取得に失敗しました。サポートにお問い合わせください。');
    }

    if (!secretData?.ENVATO_API_KEY) {
      console.error('No Envato API key found in response:', secretData);
      throw new Error('Envato APIキーが設定されていません。');
    }

    const apiKey = secretData.ENVATO_API_KEY;
    console.log('Making request to Envato API...');
    
    // First, get the list of items
    const searchResponse = await axios.get<EnvatoResponse>('https://api.envato.com/v1/discovery/search/search/item', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
      params: {
        term: searchTerm,
        site: 'codecanyon.net',
        page: 1,
        page_size: 12
      }
    });

    console.log('Received response from Envato API:', {
      status: searchResponse.status,
      itemCount: searchResponse.data.matches?.length || 0
    });

    if (!searchResponse.data.matches || searchResponse.data.matches.length === 0) {
      console.log('No items found in Envato response');
      return [];
    }

    // Process each item
    return await Promise.all(searchResponse.data.matches.map(async (item) => {
      try {
        // Get detailed item information including images
        const itemResponse = await axios.get(`https://api.envato.com/v3/market/catalog/item?id=${item.id}`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Accept': 'application/json',
          }
        });

        const itemData = itemResponse.data;
        console.log('Retrieved item details:', {
          id: item.id,
          name: item.name,
          imageUrl: itemData.preview?.landscape_url || itemData.preview?.icon_url
        });

        return {
          id: String(item.id),
          title: item.name,
          description: item.description,
          price: Math.round(item.price_cents / 100),
          image: itemData.preview?.landscape_url || 
                itemData.preview?.icon_url || 
                item.live_preview_url || 
                item.preview_url || 
                item.thumbnail_url || 
                null
        };
      } catch (itemError) {
        console.error(`Error fetching details for item ${item.id}:`, itemError);
        return {
          id: String(item.id),
          title: item.name,
          description: item.description,
          price: Math.round(item.price_cents / 100),
          image: item.live_preview_url || item.preview_url || item.thumbnail_url || null
        };
      }
    }));
  } catch (error) {
    console.error('Error fetching Envato items:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Envato APIのエンドポイントにアクセスできません。APIキーの権限を確認してください。\n\n必要な権限:\n- "View and search Envato sites"\n- "View your items\' sales history"');
      }
      if (error.response?.status === 403) {
        throw new Error('Envato APIキーが無効です。正しいAPIキーを設定してください。\nEnvato APIキーは https://build.envato.com/create-token/ で生成できます。');
      }
      if (error.response?.data) {
        console.error('API Error response:', error.response.data);
      }
    }
    throw error;
  }
}