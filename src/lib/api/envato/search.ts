import axios from 'axios';
import { EnvatoItem, EnvatoResponse } from '../../types/envato';
import { handleEnvatoError } from '../../utils/image-utils';
import { ENVATO_CONFIG } from './config';

export const searchEnvatoItems = async (apiKey: string, searchTerm: string): Promise<EnvatoItem[]> => {
  console.log('Making request to Envato API with search term:', searchTerm);
  const allItems: EnvatoItem[] = [];
  const { PAGE_SIZE, MAX_PAGES, REQUEST_DELAY, API_ENDPOINTS } = ENVATO_CONFIG;

  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      console.log(`Fetching page ${page} of Envato items...`);
      const searchResponse = await axios.get<EnvatoResponse>(API_ENDPOINTS.SEARCH, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
        },
        params: {
          term: searchTerm,
          site: 'codecanyon.net',
          page: page,
          page_size: PAGE_SIZE,
          sort_by: 'sales'
        },
        timeout: 30000
      });

      if (!searchResponse.data?.matches) {
        console.error('Invalid or empty response from Envato API:', searchResponse.data);
        break;
      }

      const items = searchResponse.data.matches;
      console.log(`Retrieved ${items.length} items from Envato API`);

      if (items.length === 0) {
        console.log(`No more items found on page ${page}`);
        break;
      }

      allItems.push(...items);
      console.log(`Total items retrieved so far: ${allItems.length}`);

      if (page < MAX_PAGES && items.length === PAGE_SIZE) {
        console.log(`Waiting ${REQUEST_DELAY}ms before next request...`);
        await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY));
      } else {
        break;
      }
    }

    console.log('Total items retrieved:', allItems.length);
    return allItems;
  } catch (error) {
    console.error('Error searching Envato items:', error);
    return handleEnvatoError(error);
  }
};