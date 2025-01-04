export const ENVATO_CONFIG = {
  PAGE_SIZE: 100,
  MAX_PAGES: 100,
  REQUEST_DELAY: 500,
  API_ENDPOINTS: {
    SEARCH: 'https://api.envato.com/v1/discovery/search/search/item',
    ITEM_DETAILS: 'https://api.envato.com/v3/market/catalog/item'
  }
} as const;