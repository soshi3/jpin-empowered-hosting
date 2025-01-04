import { Globe, Layout, LayoutDashboard, ShoppingCart, Users, Briefcase, Code, Palette } from "lucide-react";
import { LucideIcon } from "lucide-react";

export type ProductCategory = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
};

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: 'web-app',
    name: 'Webアプリケーション',
    description: 'フルスタックのWebアプリケーション',
    icon: Globe,
  },
  {
    id: 'landing-page',
    name: 'ランディングページ',
    description: '高コンバージョンのランディングページ',
    icon: Layout,
  },
  {
    id: 'dashboard',
    name: '管理画面',
    description: '使いやすい管理画面テンプレート',
    icon: LayoutDashboard,
  },
  {
    id: 'ecommerce',
    name: 'ECサイト',
    description: 'オンラインショップテンプレート',
    icon: ShoppingCart,
  },
  {
    id: 'community',
    name: 'コミュニティ',
    description: 'SNS・コミュニティサイト',
    icon: Users,
  },
  {
    id: 'business',
    name: 'ビジネス',
    description: '企業サイトテンプレート',
    icon: Briefcase,
  },
  {
    id: 'developer',
    name: '開発者向け',
    description: '開発者向けツール・テンプレート',
    icon: Code,
  },
  {
    id: 'design',
    name: 'デザイン',
    description: 'UIキット・デザインテンプレート',
    icon: Palette,
  },
];