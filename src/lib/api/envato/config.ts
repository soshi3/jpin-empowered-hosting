export const ENVATO_CONFIG = {
  PAGE_SIZE: 30,
  MAX_PAGES: 3,
  REQUEST_DELAY: 1000,
  API_ENDPOINTS: {
    SEARCH: 'https://api.envato.com/v1/discovery/search/search/item',
    DETAILS: 'https://api.envato.com/v3/market/catalog/item'
  }
} as const;