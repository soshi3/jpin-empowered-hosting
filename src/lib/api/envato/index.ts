import { getEnvatoApiKey } from './key';
import { searchEnvatoItems } from './search';
import { processEnvatoItem } from './process';
import { supabase } from '@/integrations/supabase/client';
import { ProcessedItem } from '../../types/envato';

export const fetchEnvatoItems = async (searchTerm: string = 'wordpress'): Promise<ProcessedItem[]> => {
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
    return sortedProducts as ProcessedItem[] || processedItems;
  } catch (error) {
    console.error('Error in fetchEnvatoItems:', error);
    
    // Try to fetch from database as fallback
    console.log('Attempting to fetch products from database as fallback...');
    const { data: fallbackProducts, error: fallbackError } = await supabase
      .from('products')
      .select('*')
      .order('sales', { ascending: false });

    if (fallbackError) {
      console.error('Error fetching fallback products:', fallbackError);
      throw new Error('商品情報の取得に失敗しました。しばらく経ってからもう一度お試しください。');
    }

    if (fallbackProducts && fallbackProducts.length > 0) {
      console.log('Retrieved fallback products from database:', fallbackProducts.length);
      return fallbackProducts as ProcessedItem[];
    }

    throw new Error('商品情報の取得に失敗しました。しばらく経ってからもう一度お試しください。');
  }
};