export interface EnvatoItem {
  id: number;
  name: string;
  description: string;
  price_cents: number;
  author_username: string;
  preview_url: string;
  thumbnail_url: string;
  live_preview_url: string;
  classification?: string;
  tags?: string[];
  number_of_sales?: number;
  rating?: number;
}

export interface EnvatoItemPreview {
  landscape_preview?: {
    landscape_url?: string;
  };
  icon_with_landscape_preview?: {
    landscape_url?: string;
  };
  preview_images?: Array<{
    landscape_url?: string;
  }>;
  preview_url?: string;
  live_preview_url?: string;
}

export interface EnvatoDetailedItem {
  id: number;
  name: string;
  previews: EnvatoItemPreview;
  url: string;
  live_site_preview: string;
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
  additional_images?: string[];
  category?: string | null;
  tags?: string[];
  author?: string;
  sales?: number;
  rating?: number;
  demo_url?: string | null;
  live_preview_url?: string | null;
  url?: string;
  created_at?: string;
  updated_at?: string;
  envato_id?: number;
}