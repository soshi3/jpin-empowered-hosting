import axios from 'axios';
import { EnvatoDetailedItem } from '../../types/envato';
import { handleEnvatoError } from '../../utils/image-utils';

export const getDetailedItemInfo = async (itemId: number, apiKey: string): Promise<EnvatoDetailedItem> => {
  console.log(`Fetching detailed information for item ${itemId}`);
  try {
    const response = await axios.get<EnvatoDetailedItem>(
      `https://api.envato.com/v3/market/catalog/item?id=${itemId}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
        }
      }
    );

    console.log(`Received detailed info for item ${itemId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for item ${itemId}:`, error);
    return handleEnvatoError(error);
  }
};