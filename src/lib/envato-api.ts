import axios from 'axios';
import { ProcessedItem } from './types/envato';

interface EnvatoResponse {
  matches: Array<{
    id: number;
    name: string;
    author_username: string;
    summary: string;
    description: string;
    updated_at: string;
    number_of_sales: number;
    price_cents: number;
    preview_url: string;
    classification: string;
    wordpress_theme_metadata?: {
      theme_name: string;
      description: string;
      tags: string[];
    };
  }>;
  total_items: number;
  took: number;
}

interface ProcessedEnvatoResponse {
  items: ProcessedItem[];
  total: number;
  hasMore: boolean;
  currentPage: number;
}

const ITEMS_PER_PAGE = 12;

export const fetchEnvatoItems = async (
  searchQuery: string = 'wordpress',
  page: number = 1
): Promise<ProcessedEnvatoResponse> => {
  console.log(`Fetching Envato items for query: ${searchQuery}, page: ${page}`);
  
  try {
    const response = await axios.get<EnvatoResponse>('/api/get-envato-items', {
      params: {
        search_query: searchQuery,
        page
      }
    });

    // Log the raw response for debugging
    console.log('Raw Envato API Response:', response.data);

    if (!response.data || !response.data.matches) {
      console.error('Invalid response format from Envato API:', response.data);
      throw new Error('Invalid response format from Envato API');
    }

    const envatoData = response.data;
    console.log('Processed Envato API Response:', envatoData);

    const processedItems: ProcessedItem[] = envatoData.matches.map(item => ({
      id: item.id.toString(),
      title: item.wordpress_theme_metadata?.theme_name || item.name,
      description: item.wordpress_theme_metadata?.description || item.description,
      author: item.author_username,
      updatedAt: new Date(item.updated_at),
      sales: item.number_of_sales,
      price: item.price_cents / 100,
      previewUrl: item.preview_url,
      tags: item.wordpress_theme_metadata?.tags || [],
      category: item.classification,
      image: item.preview_url
    }));

    const totalItems = envatoData.total_items;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const hasMore = page < totalPages;

    console.log(`Processed ${processedItems.length} items. Has more: ${hasMore}`);

    return {
      items: processedItems,
      total: totalItems,
      hasMore,
      currentPage: page
    };
  } catch (error) {
    console.error('Error fetching Envato items:', error);
    throw new Error('Failed to fetch items from Envato');
  }
};