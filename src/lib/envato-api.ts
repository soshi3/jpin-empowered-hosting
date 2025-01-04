import axios from 'axios';

const ENVATO_API_URL = 'https://api.envato.com/v3/market';

interface EnvatoItem {
  id: number;
  name: string;
  description: string;
  price_cents: number;
  preview_url: string;
}

interface EnvatoResponse {
  matches: EnvatoItem[];
}

export const fetchEnvatoItems = async (searchTerm: string = 'wordpress') => {
  console.log('Fetching Envato items...');
  try {
    const apiKey = import.meta.env.VITE_ENVATO_API_KEY;
    if (!apiKey) {
      throw new Error('Envato APIキーが設定されていません。');
    }

    const response = await axios.get<EnvatoResponse>(`${ENVATO_API_URL}/catalog/search`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      params: {
        term: searchTerm,
        site: 'codecanyon.net'
      }
    });
    
    console.log('Envato API response:', response.data);
    
    return response.data.matches.map(item => ({
      id: String(item.id),
      title: item.name,
      description: item.description,
      price: Math.round(item.price_cents / 100),
      image: item.preview_url
    }));
  } catch (error) {
    console.error('Error fetching Envato items:', error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Envato APIキーが無効です。正しいAPIキーを設定してください。');
    }
    throw error;
  }
}