export interface EnvatoItem {
  id: number;
  name: string;
  description: string;
  price_cents: number;
  author_username: string;
  preview_url: string;
  thumbnail_url: string;
  live_preview_url: string;
}

export interface EnvatoItemPreview {
  landscape_url?: string;
  icon_with_landscape_preview?: {
    landscape_url?: string;
  };
  icon_url?: string;
}

export interface EnvatoDetailedItem {
  preview?: EnvatoItemPreview;
}

export interface EnvatoResponse {
  matches: EnvatoItem[];
}

export interface ProcessedItem {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}