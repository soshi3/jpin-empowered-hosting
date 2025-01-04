import axios from 'axios';
import { EnvatoItem, EnvatoResponse } from '../../types/envato';
import { handleEnvatoError } from '../../utils/image-utils';

export const searchEnvatoItems = async (apiKey: string, searchTerm: string): Promise<EnvatoItem[]> => {
  console.log('Making request to Envato API with search term:', searchTerm);
  const allItems: EnvatoItem[] = [];
  const pageSize = 30;
  const maxPages = 3;

  try {
    for (let page = 1; page <= maxPages; page++) {
      console.log(`Fetching page ${page} of Envato items...`);
      const searchResponse = await axios.get<EnvatoResponse>('https://api.envato.com/v1/discovery/search/search/item', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
        },
        params: {
          term: searchTerm,
          site: 'codecanyon.net',
          page: page,
          page_size: pageSize,
          sort_by: 'sales'
        }
      });

      const items = searchResponse.data.matches || [];
      if (items.length === 0) {
        console.log(`No more items found on page ${page}`);
        break;
      }

      allItems.push(...items);
      console.log(`Retrieved ${items.length} items from page ${page}. Total items so far: ${allItems.length}`);

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('Total items retrieved:', allItems.length);
    return allItems;
  } catch (error) {
    console.error('Error searching Envato items:', error);
    return handleEnvatoError(error);
  }
};