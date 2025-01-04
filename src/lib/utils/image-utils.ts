import { EnvatoItem, EnvatoDetailedItem } from '../types/envato';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80';

export const getBestImageUrl = (
  itemData: EnvatoDetailedItem,
  searchItem: EnvatoItem
): string => {
  console.log('Getting best image URL for item:', searchItem.id);
  
  // First try to get the preview URL from the search response
  if (searchItem.preview_url) {
    console.log('Found preview URL:', searchItem.preview_url);
    return searchItem.preview_url;
  }

  if (searchItem.live_preview_url) {
    console.log('Found live preview URL:', searchItem.live_preview_url);
    return searchItem.live_preview_url;
  }

  if (searchItem.thumbnail_url) {
    console.log('Found thumbnail URL:', searchItem.thumbnail_url);
    return searchItem.thumbnail_url;
  }

  // Then try to get preview images from the detailed response
  if (itemData.preview) {
    const previewUrls = [
      itemData.preview.landscape_url,
      itemData.preview.icon_with_landscape_preview?.landscape_url,
      itemData.preview.icon_url
    ].filter(Boolean);

    if (previewUrls.length > 0) {
      console.log('Found preview image from detailed response:', previewUrls[0]);
      return previewUrls[0];
    }
  }

  console.log('No preview image found, using fallback image');
  return DEFAULT_FALLBACK_IMAGE;
};