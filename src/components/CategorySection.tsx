import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Brush,
  ShoppingCart,
  Users,
  Calendar,
  MessageCircle,
  Layout,
  Shield,
  Newspaper,
} from "lucide-react";

interface CategoryProps {
  onSelect: (category: string) => void;
  selectedCategory: string;
}

export const CategorySection = ({ onSelect, selectedCategory }: CategoryProps) => {
  const { t } = useLanguage();

  const categories = [
    { id: "all", icon: Layout, label: t("allProducts") },
    { id: "ecommerce", icon: ShoppingCart, label: t("ecommerce") },
    { id: "social", icon: Users, label: t("social") },
    { id: "booking", icon: Calendar, label: t("booking") },
    { id: "forum", icon: MessageCircle, label: t("forum") },
    { id: "security", icon: Shield, label: t("security") },
    { id: "design", icon: Brush, label: t("design") },
    { id: "blog", icon: Newspaper, label: t("blog") },
  ];

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">{t("categories")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              variant={selectedCategory === id ? "default" : "outline"}
              className="w-full h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => onSelect(id)}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm">{label}</span>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};