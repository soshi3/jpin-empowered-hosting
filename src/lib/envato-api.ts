import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';
import { EnvatoItem, EnvatoResponse, ProcessedItem } from './types/envato';
import { getBestImageUrl } from './utils/image-utils';

const getEnvatoApiKey = async (): Promise<string> => {
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

  return secretData.ENVATO_API_KEY;
};

const searchEnvatoItems = async (apiKey: string, searchTerm: string): Promise<EnvatoItem[]> => {
  console.log('Making request to Envato API...');
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

  return searchResponse.data.matches;
};

const processEnvatoItem = async (item: EnvatoItem, apiKey: string): Promise<ProcessedItem> => {
  try {
    const itemResponse = await axios.get(`https://api.envato.com/v3/market/catalog/item?id=${item.id}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      }
    });

    console.log('Retrieved item details:', {
      id: item.id,
      name: item.name
    });

    const imageUrl = getBestImageUrl(itemResponse.data, item);

    return {
      id: String(item.id),
      title: item.name,
      description: item.description,
      price: Math.round(item.price_cents / 100),
      image: imageUrl
    };
  } catch (error) {
    console.error(`Error processing item ${item.id}:`, error);
    return {
      id: String(item.id),
      title: item.name,
      description: item.description,
      price: Math.round(item.price_cents / 100),
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80'
    };
  }
};

export const fetchEnvatoItems = async (searchTerm: string = 'wordpress') => {
  console.log('Fetching Envato items with search term:', searchTerm);
  try {
    const apiKey = await getEnvatoApiKey();
    const items = await searchEnvatoItems(apiKey, searchTerm);
    return await Promise.all(items.map(item => processEnvatoItem(item, apiKey)));
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
};