import axios from 'axios';
import { EnvatoResponse } from '../../types/envato';

const ENVATO_API_URL = 'https://api.envato.com/v1/discovery/search/search/item';

export const createEnvatoSearchClient = (token: string) => {
  return axios.create({
    baseURL: ENVATO_API_URL,
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
    console.log('Making Envato API request with query:', query);
    const response = await client.get('', {
      params: {
        term: query,
        site: 'codecanyon.net',
        page,
        page_size: 30,
        sort_by: 'sales'
      }
    });
    
    console.log('Raw API response:', response.data);
    
    if (!response.data || typeof response.data !== 'object') {
      console.warn('Invalid response format from Envato API:', response.data);
      throw new Error('Invalid response format from Envato API');
    }

    // Ensure matches is an array
    const matches = Array.isArray(response.data.matches) ? response.data.matches : [];
    console.log(`Found ${matches.length} matches in search response`);
    
    return { matches };
  } catch (error) {
    console.error('Error searching Envato items:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Invalid Envato API key. Please check your API key configuration.');
      }
      if (error.response?.status === 403) {
        throw new Error('Access denied. Please check your Envato API key permissions.');
      }
      if (error.response?.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      }
    }
    // Fallback to empty matches instead of throwing
    return { matches: [] };
  }
};