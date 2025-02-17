import { supabase } from '@/integrations/supabase/client';
import { EnvatoItem, ProcessedItem } from '../../types/envato';
import { getDetailedItemInfo } from './details';
import { getBestImageUrl, getAdditionalImageUrls } from '../../utils/image-utils';

export const processEnvatoItem = async (item: EnvatoItem, apiKey: string): Promise<ProcessedItem> => {
  try {
    console.log(`Processing item ${item.id}: ${item.name}`);
    const detailedItem = await getDetailedItemInfo(item.id, apiKey);
    const imageUrl = getBestImageUrl(detailedItem, item);
    const additional_images = getAdditionalImageUrls(detailedItem);

    const { data: existingProduct, error: selectError } = await supabase
      .from('products')
      .select('sales')
      .eq('id', String(item.id))
      .maybeSingle();

    if (selectError) {
      console.error(`Error checking for existing product ${item.id}:`, selectError);
    }

    const productData: ProcessedItem = {
      id: String(item.id),
      title: item.name,
      description: item.description,
      price: Math.round(item.price_cents / 100),
      image: imageUrl,
      additional_images: additional_images,
      sales: (existingProduct?.sales || 0) + 1,
      demo_url: detailedItem.url || null,
      url: detailedItem.url || item.preview_url || `https://codecanyon.net/item/${item.id}`,
      live_preview_url: detailedItem.live_site_preview || item.live_preview_url || null,
      category: null,
      tags: [],
      author: item.author_username || null,
      rating: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      envato_id: item.id
    };

    try {
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
          .insert(productData);

        if (insertError) {
          console.error(`Error inserting product ${item.id}:`, insertError);
        } else {
          console.log(`Successfully inserted product ${item.id}`);
        }
      }
    } catch (dbError) {
      console.error(`Database operation failed for product ${item.id}:`, dbError);
    }

    return productData;
  } catch (error) {
    console.error(`Error processing item ${item.id}:`, error);
    // Return a valid ProcessedItem even in error case
    return {
      id: String(item.id),
      title: item.name,
      description: item.description,
      price: Math.round(item.price_cents / 100),
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80',
      additional_images: [],
      demo_url: null,
      url: item.preview_url || `https://codecanyon.net/item/${item.id}`,
      live_preview_url: null,
      category: null,
      tags: [],
      author: null,
      sales: 0,
      rating: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      envato_id: item.id
    };
  }
};