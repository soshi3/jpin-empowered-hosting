import { ProcessedItem } from "@/lib/types/envato";

export const categorizeProducts = (products: ProcessedItem[] | undefined) => {
  if (!products) return {};
  
  return products.reduce((acc: Record<string, ProcessedItem[]>, product) => {
    const categories = new Set<string>();
    const titleLower = product.title?.toLowerCase() || '';
    const descLower = product.description?.toLowerCase() || '';
    const tagsLower = product.tags?.map(tag => tag.toLowerCase()) || [];
    
    // Templates category
    if (
      titleLower.includes('template') ||
      descLower.includes('template') ||
      tagsLower.includes('template') ||
      titleLower.includes('theme') ||
      descLower.includes('theme')
    ) {
      categories.add('templates');
    }

    // Web Applications category
    if (
      titleLower.includes('application') ||
      titleLower.includes('app') ||
      descLower.includes('application') ||
      descLower.includes('app') ||
      titleLower.includes('plugin') ||
      titleLower.includes('module') ||
      tagsLower.includes('application') ||
      tagsLower.includes('plugin')
    ) {
      categories.add('web-applications');
    }

    // Business category
    if (
      titleLower.includes('business') ||
      titleLower.includes('corporate') ||
      titleLower.includes('company') ||
      descLower.includes('business solution') ||
      descLower.includes('business management') ||
      tagsLower.includes('business') ||
      tagsLower.includes('corporate')
    ) {
      categories.add('business');
    }

    // E-commerce category
    if (
      titleLower.includes('ecommerce') ||
      titleLower.includes('e-commerce') ||
      titleLower.includes('shop') ||
      titleLower.includes('store') ||
      titleLower.includes('woocommerce') ||
      descLower.includes('ecommerce') ||
      descLower.includes('e-commerce') ||
      tagsLower.includes('ecommerce') ||
      tagsLower.includes('woocommerce')
    ) {
      categories.add('ecommerce');
    }

    // Corporate category
    if (
      titleLower.includes('corporate') ||
      titleLower.includes('enterprise') ||
      titleLower.includes('company portal') ||
      descLower.includes('corporate') ||
      descLower.includes('enterprise solution') ||
      tagsLower.includes('corporate') ||
      tagsLower.includes('enterprise')
    ) {
      categories.add('corporate');
    }

    // Blog category
    if (
      titleLower.includes('blog') ||
      titleLower.includes('magazine') ||
      titleLower.includes('news') ||
      descLower.includes('blog') ||
      descLower.includes('blogging') ||
      tagsLower.includes('blog') ||
      tagsLower.includes('magazine')
    ) {
      categories.add('blog');
    }

    // Portfolio category
    if (
      titleLower.includes('portfolio') ||
      titleLower.includes('showcase') ||
      titleLower.includes('gallery') ||
      descLower.includes('portfolio') ||
      descLower.includes('showcase') ||
      tagsLower.includes('portfolio') ||
      tagsLower.includes('gallery')
    ) {
      categories.add('portfolio');
    }

    // Landing category
    if (
      titleLower.includes('landing') ||
      titleLower.includes('landing page') ||
      titleLower.includes('one page') ||
      descLower.includes('landing page') ||
      tagsLower.includes('landing') ||
      tagsLower.includes('landing page')
    ) {
      categories.add('landing');
    }

    // If no category matches, add to templates as default
    if (categories.size === 0) {
      categories.add('templates');
    }

    // Add product to each matching category
    categories.forEach(category => {
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
    });
    
    console.log(`Categorized product "${product.title}" into:`, Array.from(categories));
    
    return acc;
  }, {});
};