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
    const { data: { ENVATO_API_KEY }, error } = await supabase
      .from('secrets')
      .select('ENVATO_API_KEY')
      .single();

    if (error || !ENVATO_API_KEY) {
      console.error('Error fetching Envato API key:', error);
      throw new Error('Envato APIキーの取得に失敗しました。');
    }

    const response = await axios.get<EnvatoResponse>(`${ENVATO_API_URL}/catalog/search`, {
      headers: {
        'Authorization': `Bearer ${ENVATO_API_KEY}`,
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