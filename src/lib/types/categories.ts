export type ProductCategory = {
  id: string;
  name: string;
  description: string;
};

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: 'web-app',
    name: 'Webアプリケーション',
    description: 'フルスタックのWebアプリケーション',
  },
  {
    id: 'landing-page',
    name: 'ランディングページ',
    description: '高コンバージョンのランディングページ',
  },
  {
    id: 'dashboard',
    name: '管理画面',
    description: '使いやすい管理画面テンプレート',
  },
];