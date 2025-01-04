import { getEnvatoApiKey } from './key';
import { searchEnvatoItems } from './search';
import { processEnvatoItem } from './process';
import { supabase } from '@/integrations/supabase/client';
import axios from 'axios';

export const fetchEnvatoItems = async (searchTerm: string = 'wordpress') => {
  console.log('Fetching Envato items with search term:', searchTerm);
  try {
    const apiKey = await getEnvatoApiKey();
    const items = await searchEnvatoItems(apiKey, searchTerm);
    
    const processedItems = await Promise.all(
      items.map(item => processEnvatoItem(item, apiKey))
    );
    
    const { data: sortedProducts, error } = await supabase
      .from('products')
      .select('*')
      .order('sales', { ascending: false });

    if (error) {
      console.error('Error fetching sorted products:', error);
      return processedItems;
    }

    console.log('Successfully retrieved sorted products:', sortedProducts?.length);
    return sortedProducts || processedItems;
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