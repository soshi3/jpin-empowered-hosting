import axios from 'axios';
import { EnvatoResponse } from '../../types/envato';
import { ENVATO_CONFIG } from './config';

const createEnvatoSearchClient = (token: string) => {
  return axios.create({
    baseURL: ENVATO_CONFIG.API_ENDPOINTS.SEARCH,
    timeout: 30000,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
};

export const searchEnvatoItems = async (
  token: string,
  query: string = '',
  page: number = 1
): Promise<EnvatoResponse> => {
  const client = createEnvatoSearchClient(token);
  
  try {
    console.log(`Making Envato API request for page ${page} with query:`, query);
    const response = await client.get('', {
      params: {
        term: query,
        site: 'codecanyon.net',
        page,
        page_size: ENVATO_CONFIG.PAGE_SIZE,
        sort_by: 'sales'
      }
    });
    
    console.log(`Raw API response for page ${page}:`, response.data);
    
    if (!response.data || typeof response.data !== 'object') {
      console.warn('Invalid response format from Envato API:', response.data);
      return { matches: [] };
    }

    // Ensure matches is an array
    const matches = Array.isArray(response.data.matches) ? response.data.matches : [];
    console.log(`Found ${matches.length} matches in search response for page ${page}`);
    
    return { matches };
  } catch (error) {
    console.error(`Error searching Envato items on page ${page}:`, error);
    if (axios.isAxiosError(error)) {
      console.warn('Axios error details:', {
        status: error.response?.status,
        data: error.response?.data
      });
    }
    // Return empty matches instead of throwing to allow fallback to database
    return { matches: [] };
  }
};

export const searchAllEnvatoItems = async (
  token: string,
  query: string = ''
): Promise<EnvatoResponse> => {
  console.log('Starting multi-page search for Envato items...');
  const allMatches = [];
  
  for (let page = 1; page <= ENVATO_CONFIG.MAX_PAGES; page++) {
    console.log(`Fetching page ${page} of ${ENVATO_CONFIG.MAX_PAGES}...`);
    const { matches } = await searchEnvatoItems(token, query, page);
    
    if (!matches.length) {
      console.log(`No more items found after page ${page}`);
      break;
    }
    
    allMatches.push(...matches);
    console.log(`Total items collected so far: ${allMatches.length}`);
    
    // Add delay between requests to avoid rate limiting
    if (page < ENVATO_CONFIG.MAX_PAGES) {
      await new Promise(resolve => setTimeout(resolve, ENVATO_CONFIG.REQUEST_DELAY));
    }
  }
  
  return { matches: allMatches };
};