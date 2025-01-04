import { EnvatoItem, EnvatoDetailedItem } from '../types/envato';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80';

export const getBestImageUrl = (
  itemData: EnvatoDetailedItem,
  searchItem: EnvatoItem
): string => {
  let imageUrl: string | null = null;

  // Try to get preview images from the detailed response
  if (itemData.preview) {
    imageUrl = itemData.preview.landscape_url || 
              itemData.preview.icon_with_landscape_preview?.landscape_url ||
              itemData.preview.icon_url;
    
    if (imageUrl) {
      console.log('Found preview image from detailed response:', imageUrl);
      return imageUrl;
    }
  }

  // Try preview URLs from the search response
  imageUrl = searchItem.live_preview_url || 
            searchItem.preview_url || 
            searchItem.thumbnail_url;

  if (imageUrl) {
    console.log('Found preview image from search response:', imageUrl);
    return imageUrl;
  }

  console.log('No preview image found, using fallback image');
  return DEFAULT_FALLBACK_IMAGE;
};