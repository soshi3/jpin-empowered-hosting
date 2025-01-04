import { getEnvatoApiKey } from './key';
import { searchEnvatoItems } from './search';
import { processEnvatoItem } from './process';
import { supabase } from '@/integrations/supabase/client';
import axios from 'axios';

export const fetchEnvatoItems = async (searchTerm: string = 'wordpress') => {
  console.log('Fetching Envato items with search term:', searchTerm);
  try {
    const apiKey = await getEnvatoApiKey();
    console.log('Successfully retrieved API key');

    const searchResponse = await searchEnvatoItems(apiKey, searchTerm);
    console.log('Search response received:', {
      hasMatches: !!searchResponse?.matches,
      matchesLength: searchResponse?.matches?.length
    });

    // Ensure we have a valid array of matches
    if (!searchResponse?.matches || !Array.isArray(searchResponse.matches)) {
      console.warn('No valid matches array in search response');
      return [];
    }

    const items = searchResponse.matches;
    console.log(`Processing ${items.length} items from search`);
    
    // Process items and handle any individual processing errors
    const processedItems = await Promise.all(
      items.map(async (item) => {
        try {
          console.log(`Processing item ${item.id}: ${item.name}`);
          return await processEnvatoItem(item, apiKey);
        } catch (error) {
          console.error(`Error processing item ${item.id}:`, error);
          return null;
        }
      })
    );

    // Filter out any null results from failed processing
    const validProcessedItems = processedItems.filter(item => item !== null);
    console.log(`Successfully processed ${validProcessedItems.length} items`);
    
    // Fetch sorted products from Supabase
    const { data: sortedProducts, error } = await supabase
      .from('products')
      .select('*')
      .order('sales', { ascending: false });

    if (error) {
      console.error('Error fetching sorted products:', error);
      return validProcessedItems;
    }

    console.log('Successfully retrieved sorted products:', sortedProducts?.length);
    return sortedProducts || validProcessedItems;
  } catch (error) {
    console.error('Error in fetchEnvatoItems:', error);
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