import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';
import { EnvatoItem, EnvatoResponse, ProcessedItem, EnvatoDetailedItem } from './types/envato';
import { getBestImageUrl, handleEnvatoError } from './utils/image-utils';

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
    return handleEnvatoError(error);
  }
};

const searchEnvatoItems = async (apiKey: string, searchTerm: string): Promise<EnvatoItem[]> => {
  console.log('Making request to Envato API with search term:', searchTerm);
  const allItems: EnvatoItem[] = [];
  const pageSize = 30;
  const maxPages = 3;

  try {
    for (let page = 1; page <= maxPages; page++) {
      console.log(`Fetching page ${page} of Envato items...`);
      const searchResponse = await axios.get<EnvatoResponse>('https://api.envato.com/v1/discovery/search/search/item', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
        },
        params: {
          term: searchTerm,
          site: 'codecanyon.net',
          page: page,
          page_size: pageSize,
          sort_by: 'sales'
        }
      });

      const items = searchResponse.data.matches || [];
      if (items.length === 0) {
        console.log(`No more items found on page ${page}`);
        break;
      }

      allItems.push(...items);
      console.log(`Retrieved ${items.length} items from page ${page}. Total items so far: ${allItems.length}`);

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('Total items retrieved:', allItems.length);
    return allItems;
  } catch (error) {
    return handleEnvatoError(error);
  }
};

const getDetailedItemInfo = async (itemId: number, apiKey: string): Promise<EnvatoDetailedItem> => {
  console.log(`Fetching detailed information for item ${itemId}`);
  try {
    const response = await axios.get<EnvatoDetailedItem>(
      `https://api.envato.com/v3/market/catalog/item?id=${itemId}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
        }
      }
    );

    console.log(`Received detailed info for item ${itemId}`);
    return response.data;
  } catch (error) {
    return handleEnvatoError(error);
  }
};

const processEnvatoItem = async (item: EnvatoItem, apiKey: string): Promise<ProcessedItem> => {
  try {
    console.log(`Processing item ${item.id}: ${item.name}`);
    const detailedItem = await getDetailedItemInfo(item.id, apiKey);
    const imageUrl = getBestImageUrl(detailedItem, item);

    // Check for existing product using maybeSingle() instead of single()
    const { data: existingProduct, error: selectError } = await supabase
      .from('products')
      .select('sales')
      .eq('id', String(item.id))
      .maybeSingle();

    if (selectError) {
      console.error(`Error checking for existing product ${item.id}:`, selectError);
    }

    const productData = {
      id: String(item.id),
      title: item.name,
      description: item.description,
      price: Math.round(item.price_cents / 100),
      image: imageUrl,
      sales: (existingProduct?.sales || 0) + 1,
      updated_at: new Date().toISOString()
    };

    if (existingProduct) {
      console.log(`Updating existing product ${item.id}`);
      const { error: updateError } = await supabase
        .from('products')
        .update(productData)
        .eq('id', String(item.id));

      if (updateError) {
        console.error(`Error updating product ${item.id}:`, updateError);
      } else {
        console.log(`Successfully updated product ${item.id}`);
      }
    } else {
      console.log(`Inserting new product ${item.id}`);
      const { error: insertError } = await supabase
        .from('products')
        .insert({
          ...productData,
          created_at: new Date().toISOString()
        });

      if (insertError) {
        console.error(`Error inserting product ${item.id}:`, insertError);
      } else {
        console.log(`Successfully inserted product ${item.id}`);
      }
    }

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