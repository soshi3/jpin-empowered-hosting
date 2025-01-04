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
      return { matches: [] };
    }

    // Ensure matches is an array
    const matches = Array.isArray(response.data.matches) ? response.data.matches : [];
    console.log(`Found ${matches.length} matches in search response`);
    
    return { matches };
  } catch (error) {
    console.error('Error searching Envato items:', error);
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