import axios from 'axios';
import { EnvatoSearchResponse } from '../../types/envato';

const ENVATO_API_URL = 'https://api.envato.com/v1/discovery/search/search/item';

export const createEnvatoSearchClient = (token: string) => {
  return axios.create({
    baseURL: ENVATO_API_URL,
    timeout: 30000,
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
};

export const searchEnvatoItems = async (
  token: string,
  query: string = '',
  page: number = 1
): Promise<EnvatoSearchResponse> => {
  const client = createEnvatoSearchClient(token);
  
  try {
    console.log('Searching Envato items with query:', query);
    const response = await client.get('', {
      params: {
        term: query,
        page,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching Envato items:', error);
    throw error;
  }
};