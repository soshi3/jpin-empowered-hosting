import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES } from "@/lib/types/categories";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter = ({ onCategoryChange }: CategoryFilterProps) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    const handleHashChange = () => {
      const category = window.location.hash ? window.location.hash.slice(1) : "all";
      setActiveCategory(category);
      onCategoryChange(category);
    };

    // Initial value
    handleHashChange();

    // Add hashchange event listener
    window.addEventListener("hashchange", handleHashChange);

    // Cleanup
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [onCategoryChange]);

  const handleCategoryClick = (categoryId: string) => {
    window.location.hash = categoryId === "all" ? "" : `#${categoryId}`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      <Button
        variant="outline"
        className={cn(
          "flex flex-col items-center gap-2 h-auto py-4 hover:bg-primary hover:text-primary-foreground",
          activeCategory === "all" && "bg-primary text-primary-foreground"
        )}
        onClick={() => handleCategoryClick("all")}
      >
        <ArrowRight className="w-6 h-6" />
        <div className="flex flex-col text-sm">
          <span>すべて</span>
          <span>All</span>
        </div>
      </Button>
      {PRODUCT_CATEGORIES.map((category) => {
        const Icon = category.icon;
        return (
          <Button
            key={category.id}
            variant="outline"
            className={cn(
              "flex flex-col items-center gap-2 h-auto py-4 hover:bg-primary hover:text-primary-foreground",
              activeCategory === category.id && "bg-primary text-primary-foreground"
            )}
            onClick={() => handleCategoryClick(category.id)}
          >
            <Icon className="w-6 h-6" />
            <div className="flex flex-col text-sm">
              <span>{category.name}</span>
              <span>{category.nameEn}</span>
            </div>
          </Button>
        );
      })}
    </div>
  );
};