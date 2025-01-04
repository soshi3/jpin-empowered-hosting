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
    
    // Ensure response has the expected structure
    if (!response.data || typeof response.data !== 'object') {
      console.warn('Invalid response format from Envato API:', response.data);
      return { matches: [] };
    }

    // Ensure matches is an array
    if (!Array.isArray(response.data.matches)) {
      console.warn('Response matches is not an array:', response.data.matches);
      return { matches: [] };
    }
    
    console.log(`Found ${response.data.matches.length} matches in search response`);
    return response.data;
  } catch (error) {
    console.error('Error searching Envato items:', error);
    return { matches: [] };
  }
};