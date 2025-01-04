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
    console.log('Searching Envato items with query:', query);
    const response = await client.get('', {
      params: {
        term: query,
        site: 'codecanyon.net',
        page,
        page_size: 30,
        sort_by: 'sales'
      }
    });
    
    // Validate response structure
    if (!response.data || !response.data.matches) {
      console.warn('Invalid response structure from Envato API:', response.data);
      return { matches: [] };
    }
    
    console.log('Search response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error searching Envato items:', error);
    throw error;
  }
};