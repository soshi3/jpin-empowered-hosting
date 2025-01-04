import { EnvatoItem, EnvatoDetailedItem } from '../types/envato';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80';

export const getBestImageUrl = (
  detailedItem: EnvatoDetailedItem,
  searchItem: EnvatoItem
): string => {
  const possibleImageUrls = [
    detailedItem.previews?.landscape_preview?.landscape_url,
    detailedItem.previews?.icon_with_landscape_preview?.landscape_url,
    detailedItem.previews?.preview_images?.[0]?.landscape_url,
    detailedItem.previews?.preview_url,
    detailedItem.previews?.live_preview_url,
    searchItem.live_preview_url,
    searchItem.preview_url,
    searchItem.thumbnail_url
  ];

  const imageUrl = possibleImageUrls.find(url => url && typeof url === 'string');
  
  if (imageUrl) {
    console.log(`Found image URL for item ${searchItem.id}:`, imageUrl);
    return imageUrl;
  }

  console.log(`No image URL found for item ${searchItem.id}, using default fallback`);
  return DEFAULT_FALLBACK_IMAGE;
};

export const handleEnvatoError = (error: unknown): never => {
  console.error('Envato API error:', error);
  
  if (error instanceof Error) {
    if (error.message.includes('Network Error') || error.message.includes('ECONNREFUSED')) {
      throw new Error('インターネット接続を確認してください。サーバーに接続できません。');
    }
    throw error;
  }
  
  throw new Error('予期せぬエラーが発生しました。しばらく待ってから再度お試しください。');
};