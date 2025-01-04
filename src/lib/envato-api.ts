import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';
import { EnvatoItem, EnvatoResponse, ProcessedItem } from './types/envato';
import { getBestImageUrl } from './utils/image-utils';

const getEnvatoApiKey = async (): Promise<string> => {
  console.log('Invoking get-envato-key function...');
  try {
    const { data: secretData, error: secretError } = await supabase.functions.invoke('get-envato-key');
    
    if (secretError) {
      console.error('Error invoking get-envato-key function:', secretError);
      throw new Error('Envato APIキーの取得に失敗しました。サポートにお問い合わせください。');
    }

    if (!secretData?.ENVATO_API_KEY) {
      console.error('No Envato API key found in response:', secretData);
      throw new Error('Envato APIキーが設定されていません。');
    }

    console.log('Successfully retrieved Envato API key');
    return secretData.ENVATO_API_KEY;
  } catch (error) {
    console.error('Failed to get Envato API key:', error);
    if (axios.isAxiosError(error) && error.message === 'Network Error') {
      throw new Error('ネットワークエラーが発生しました。インターネット接続を確認してください。');
    }
    throw error;
  }
};

const searchEnvatoItems = async (apiKey: string, searchTerm: string): Promise<EnvatoItem[]> => {
  console.log('Making request to Envato API with search term:', searchTerm);
  try {
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
  } catch (error) {
    console.error('Error searching Envato items:', error);
    if (axios.isAxiosError(error) && error.message === 'Network Error') {
      throw new Error('Envato APIへの接続に失敗しました。インターネット接続を確認してください。');
    }
    throw error;
  }
};

const processEnvatoItem = async (item: EnvatoItem, apiKey: string): Promise<ProcessedItem> => {
  try {
    console.log(`Processing item ${item.id}: ${item.name}`);
    
    // First try to get the preview image directly from the search response
    if (item.live_preview_url || item.preview_url || item.thumbnail_url) {
      const imageUrl = item.live_preview_url || item.preview_url || item.thumbnail_url;
      console.log(`Using direct preview URL for item ${item.id}:`, imageUrl);
      return {
        id: String(item.id),
        title: item.name,
        description: item.description,
        price: Math.round(item.price_cents / 100),
        image: imageUrl
      };
    }

    // If no direct preview URL is available, try to get detailed item information
    console.log(`Fetching detailed information for item ${item.id}`);
    const itemResponse = await axios.get(`https://api.envato.com/v3/market/catalog/item?id=${item.id}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      }
    });

    console.log('Retrieved item details:', {
      id: item.id,
      name: item.name,
      hasPreview: !!itemResponse.data.preview
    });

    const imageUrl = getBestImageUrl(itemResponse.data, item);
    console.log(`Final image URL for item ${item.id}:`, imageUrl);

    return {
      id: String(item.id),
      title: item.name,
      description: item.description,
      price: Math.round(item.price_cents / 100),
      image: imageUrl
    };
  } catch (error) {
    console.error(`Error processing item ${item.id}:`, error);
    // Fallback to basic item data with default image
    return {
      id: String(item.id),
      title: item.name,
      description: item.description,
      price: Math.round(item.price_cents / 100),
      image: item.preview_url || item.thumbnail_url || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80'
    };
  }
};

export const fetchEnvatoItems = async (searchTerm: string = 'wordpress') => {
  console.log('Fetching Envato items with search term:', searchTerm);
  try {
    const apiKey = await getEnvatoApiKey();
    const items = await searchEnvatoItems(apiKey, searchTerm);
    const processedItems = await Promise.all(items.map(item => processEnvatoItem(item, apiKey)));
    console.log('Successfully processed all items:', processedItems.length);
    return processedItems;
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