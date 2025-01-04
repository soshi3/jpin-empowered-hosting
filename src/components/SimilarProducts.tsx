import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "./ProductCard";
import { Loader2 } from "lucide-react";

interface SimilarProductsProps {
  currentProductId: string;
  category?: string | null;
  priceRange?: number;
}

export const SimilarProducts = ({ currentProductId, category, priceRange = 100 }: SimilarProductsProps) => {
  const { data: similarProducts, isLoading } = useQuery({
    queryKey: ["similar-products", currentProductId, category, priceRange],
    queryFn: async () => {
      console.log('Fetching similar products for:', { currentProductId, category, priceRange });
      
      let query = supabase
        .from('products')
        .select('*')
        .neq('id', currentProductId)
        .order('sales', { ascending: false })
        .limit(6);

      if (category) {
        query = query.eq('category', category);
      }

      if (priceRange) {
        const { data: currentProduct } = await supabase
          .from('products')
          .select('price')
          .eq('id', currentProductId)
          .single();

        if (currentProduct?.price) {
          const minPrice = Math.max(0, currentProduct.price - priceRange);
          const maxPrice = currentProduct.price + priceRange;
          query = query.gte('price', minPrice).lte('price', maxPrice);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching similar products:', error);
        return [];
      }

      console.log('Found similar products:', data?.length);
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!similarProducts?.length) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">類似商品</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {similarProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            description={product.description}
            price={product.price}
            image={product.image}
          />
        ))}
      </div>
    </div>
  );
};