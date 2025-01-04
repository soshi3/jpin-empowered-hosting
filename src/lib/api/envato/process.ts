import { supabase } from '@/integrations/supabase/client';
import { EnvatoItem, ProcessedItem } from '../../types/envato';
import { getDetailedItemInfo } from './details';
import { getBestImageUrl } from '../../utils/image-utils';

export const processEnvatoItem = async (item: EnvatoItem, apiKey: string): Promise<ProcessedItem> => {
  try {
    console.log(`Processing item ${item.id}: ${item.name}`);
    const detailedItem = await getDetailedItemInfo(item.id, apiKey);
    const imageUrl = getBestImageUrl(detailedItem, item);

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

    return productData;
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