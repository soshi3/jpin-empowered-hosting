export interface Review {
  id: number;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: {
    email: string;
  };
}