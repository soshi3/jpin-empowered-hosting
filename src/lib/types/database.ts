export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      accounts: AccountsTable
      inquiries: InquiriesTable
      messages: MessagesTable
      products: ProductsTable
      profiles: ProfilesTable
      reviews: ReviewsTable
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

interface AccountsTable {
  Row: {
    created_at: string
    created_by: string | null
    description_en: string
    description_ja: string
    followers: number
    id: number
    is_promoted: boolean | null
    platform: string
    price: number
    promoted_until: string | null
    title_en: string
    title_ja: string
    updated_at: string
  }
  Insert: Omit<AccountsTable['Row'], 'id'>
  Update: Partial<AccountsTable['Row']>
}

interface InquiriesTable {
  Row: {
    account_id: number | null
    created_at: string
    from_user_id: string | null
    id: number
    status: string
    to_user_id: string | null
    updated_at: string
  }
  Insert: Omit<InquiriesTable['Row'], 'id'>
  Update: Partial<InquiriesTable['Row']>
}

interface MessagesTable {
  Row: {
    content: string
    created_at: string
    from_user_id: string | null
    id: number
    inquiry_id: number | null
    updated_at: string
  }
  Insert: Omit<MessagesTable['Row'], 'id'>
  Update: Partial<MessagesTable['Row']>
}

interface ProductsTable {
  Row: {
    additional_images: string[] | null
    author: string | null
    category: string | null
    created_at: string
    description: string
    envato_id: number | null
    id: string
    image: string
    price: number
    rating: number | null
    sales: number | null
    tags: string[] | null
    title: string
    updated_at: string
    demo_url: string | null
    live_preview_url: string | null
  }
  Insert: Omit<ProductsTable['Row'], 'created_at' | 'updated_at'>
  Update: Partial<ProductsTable['Row']>
}

interface ProfilesTable {
  Row: {
    created_at: string
    email: string
    id: string
    is_admin: boolean | null
    updated_at: string
  }
  Insert: Omit<ProfilesTable['Row'], 'created_at' | 'updated_at'>
  Update: Partial<ProfilesTable['Row']>
}

interface ReviewsTable {
  Row: {
    comment: string
    created_at: string
    id: number
    product_id: string
    rating: number
    updated_at: string
    user_id: string
  }
  Insert: Omit<ReviewsTable['Row'], 'id' | 'created_at' | 'updated_at'>
  Update: Partial<ReviewsTable['Row']>
}