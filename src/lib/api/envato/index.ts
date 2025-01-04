import { getEnvatoApiKey } from './key';
import { searchAllEnvatoItems } from './search';
import { processEnvatoItem } from './process';
import { supabase } from '@/integrations/supabase/client';
import { EnvatoItem } from '../../types/envato';

export const fetchEnvatoItems = async (searchTerm: string = 'wordpress') => {
  console.log('Fetching Envato items with search term:', searchTerm);
  try {
    const apiKey = await getEnvatoApiKey();
    console.log('Successfully retrieved API key');

    const searchResponse = await searchAllEnvatoItems(apiKey, searchTerm);
    console.log('Search response received:', {
      hasMatches: !!searchResponse?.matches,
      matchesLength: searchResponse?.matches?.length
    });

    // Ensure we have a valid array of matches
    const items: EnvatoItem[] = Array.isArray(searchResponse?.matches) ? searchResponse.matches : [];
    console.log(`Processing ${items.length} items from search`);
    
    // Try to fetch from database if API returns no results
    if (items.length === 0) {
      console.log('No items from API, trying database...');
      const { data: existingProducts, error: dbError } = await supabase
        .from('products')
        .select('*')
        .order('sales', { ascending: false });

      if (dbError) {
        console.error('Error fetching from database:', dbError);
        return [];
      }

      if (existingProducts && existingProducts.length > 0) {
        console.log('Retrieved existing products from database:', existingProducts.length);
        return existingProducts;
      }

      console.warn('No products found in either API or database');
      return [];
    }
    
    // Process items and handle any individual processing errors
    const processedItems = await Promise.all(
      items.map(async (item) => {
        try {
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
    
    // Try to fetch from database as fallback
    console.log('Attempting to fetch products from database as fallback...');
    const { data: fallbackProducts, error: fallbackError } = await supabase
      .from('products')
      .select('*')
      .order('sales', { ascending: false });

    if (fallbackError) {
      console.error('Error fetching fallback products:', fallbackError);
      return [];
    }

    if (fallbackProducts && fallbackProducts.length > 0) {
      console.log('Retrieved fallback products from database:', fallbackProducts.length);
      return fallbackProducts;
    }

    console.error('No products available from any source');
    return [];
  }
};