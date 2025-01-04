import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';

interface EnvatoItem {
  id: number;
  name: string;
  description: string;
  price_cents: number;
  preview_url: string;
  author_username: string;
  thumbnail_url: string;
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
    const response = await axios.get<EnvatoResponse>('https://api.envato.com/v1/discovery/search/search/item', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      params: {
        term: searchTerm,
        site: 'codecanyon.net',
        page: 1,
        page_size: 12
      }
    });
    
    console.log('Received response from Envato API:', {
      status: response.status,
      itemCount: response.data.matches?.length || 0
    });

    if (!response.data.matches || response.data.matches.length === 0) {
      console.log('No items found in Envato response');
      return [];
    }

    return response.data.matches.map(item => {
      // 画像URLの選択ロジックを改善
      const imageUrl = item.preview_url || item.thumbnail_url;
      console.log('Processing item:', {
        id: item.id,
        name: item.name,
        imageUrl: imageUrl
      });

      if (!imageUrl) {
        console.warn(`No image URL found for item ${item.id}`);
      }

      return {
        id: String(item.id),
        title: item.name,
        description: item.description,
        price: Math.round(item.price_cents / 100),
        image: imageUrl || null
      };
    });
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