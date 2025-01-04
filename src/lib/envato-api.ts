import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';

const ENVATO_API_URL = 'https://api.envato.com/v3/market';

interface EnvatoItem {
  id: number;
  name: string;
  description: string;
  price_cents: number;
  preview_url: string;
}

interface EnvatoResponse {
  matches: EnvatoItem[];
}

export const fetchEnvatoItems = async (searchTerm: string = 'wordpress') => {
  console.log('Fetching Envato items...');
  try {
    console.log('Invoking get-envato-key function...');
    const { data, error } = await supabase.functions.invoke('get-envato-key');
    
    if (error) {
      console.error('Error invoking get-envato-key function:', error);
      throw new Error('Envato APIキーの取得に失敗しました。サポートにお問い合わせください。');
    }

    if (!data?.ENVATO_API_KEY) {
      console.error('No Envato API key found in response:', data);
      throw new Error('Envato APIキーが設定されていません。');
    }

    console.log('Successfully retrieved API key, making request to Envato API...');
    const response = await axios.get<EnvatoResponse>(`${ENVATO_API_URL}/catalog/search`, {
      headers: {
        'Authorization': `Bearer ${data.ENVATO_API_KEY}`,
      },
      params: {
        term: searchTerm,
        site: 'codecanyon.net'
      }
    });
    
    console.log('Envato API response:', response.data);
    
    return response.data.matches.map(item => ({
      id: String(item.id),
      title: item.name,
      description: item.description,
      price: Math.round(item.price_cents / 100),
      image: item.preview_url
    }));
  } catch (error) {
    console.error('Error fetching Envato items:', error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Envato APIキーが無効です。正しいAPIキーを設定してください。');
    }
    throw error;
  }
}