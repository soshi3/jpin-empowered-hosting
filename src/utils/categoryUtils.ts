import { ProcessedItem } from "@/lib/types/envato";

export const categorizeProducts = (products: ProcessedItem[] | undefined) => {
  if (!products) return {};
  
  return products.reduce((acc: Record<string, ProcessedItem[]>, product) => {
    const categories = new Set(['web-app']); // デフォルトカテゴリー
    const titleLower = product.title.toLowerCase();
    const descLower = product.description.toLowerCase();
    
    // ビジネスカテゴリーの判定条件を拡充
    if (
      titleLower.includes('business') || 
      titleLower.includes('corporate') || 
      titleLower.includes('company') ||
      titleLower.includes('enterprise') ||
      titleLower.includes('office') ||
      descLower.includes('business') || 
      descLower.includes('corporate') ||
      descLower.includes('company') ||
      descLower.includes('enterprise') ||
      descLower.includes('office') ||
      // Wordpressのビジネステーマ関連のキーワード
      titleLower.includes('business theme') ||
      titleLower.includes('corporate theme') ||
      titleLower.includes('company theme') ||
      descLower.includes('business theme') ||
      descLower.includes('corporate theme') ||
      descLower.includes('company theme')
    ) {
      categories.add('business');
    }

    // その他のカテゴリー判定
    if (titleLower.includes('landing') || titleLower.includes('lp') || 
        descLower.includes('landing') || descLower.includes('lp')) {
      categories.add('landing-page');
    }
    if (titleLower.includes('admin') || titleLower.includes('dashboard') || 
        descLower.includes('admin') || descLower.includes('dashboard')) {
      categories.add('dashboard');
    }
    if (titleLower.includes('shop') || titleLower.includes('ecommerce') || 
        titleLower.includes('store') || descLower.includes('shop') || 
        descLower.includes('ecommerce') || descLower.includes('store')) {
      categories.add('ecommerce');
    }
    if (titleLower.includes('community') || titleLower.includes('social') || 
        titleLower.includes('forum') || descLower.includes('community') || 
        descLower.includes('social') || descLower.includes('forum')) {
      categories.add('community');
    }
    if (titleLower.includes('developer') || titleLower.includes('api') || 
        descLower.includes('developer') || descLower.includes('api')) {
      categories.add('developer');
    }
    if (titleLower.includes('design') || titleLower.includes('ui kit') || 
        descLower.includes('design') || descLower.includes('ui kit')) {
      categories.add('design');
    }

    // 各カテゴリーに商品を追加
    categories.forEach(category => {
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
    });
    
    return acc;
  }, {});
};