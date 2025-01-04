import { EnvatoItem, EnvatoDetailedItem } from '../types/envato';
import axios from 'axios';

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
    console.log(`Found main image URL for item ${searchItem.id}:`, imageUrl);
    return imageUrl;
  }

  console.log(`No main image URL found for item ${searchItem.id}, using default fallback`);
  return DEFAULT_FALLBACK_IMAGE;
};

export const getAdditionalImageUrls = (
  detailedItem: EnvatoDetailedItem
): string[] => {
  const additionalImages: string[] = [];

  if (detailedItem.previews?.preview_images) {
    // Skip the first image as it's used as the main image
    const extraImages = detailedItem.previews.preview_images
      .slice(1)
      .map(img => img.landscape_url)
      .filter((url): url is string => typeof url === 'string');
    
    if (extraImages.length > 0) {
      console.log(`Found ${extraImages.length} additional images`);
      additionalImages.push(...extraImages);
    }
  }

  return additionalImages;
};

export const handleEnvatoError = (error: unknown): never => {
  console.error('Envato API error:', error);
  
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      throw new Error('インターネット接続を確認してください。サーバーに接続できません。');
    }
    if (error.response?.status === 401) {
      throw new Error('Envato APIキーが無効です。正しいAPIキーを設定してください。');
    }
    if (error.response?.status === 403) {
      throw new Error('Envato APIへのアクセス権限がありません。APIキーの権限を確認してください。');
    }
    if (error.response?.status === 404) {
      throw new Error('リクエストされたリソースが見つかりません。');
    }
    if (error.response?.status >= 500) {
      throw new Error('Envatoサーバーでエラーが発生しました。しばらく待ってから再度お試しください。');
    }
    if (error.response?.data) {
      throw new Error(`Envato API エラー: ${error.response.data.message || '不明なエラー'}`);
    }
  }
  
  if (error instanceof Error) {
    throw error;
  }
  
  throw new Error('予期せぬエラーが発生しました。しばらく待ってから再度お試しください。');
};