import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { fetchEnvatoItems } from "@/lib/envato-api";
import { ProductImage } from "@/components/ProductImage";
import { ProductOptions } from "@/components/ProductOptions";
import { ProductHeader } from "@/components/ProductHeader";
import { ProductReviews } from "@/components/ProductReviews";
import { SimilarProducts } from "@/components/SimilarProducts";

const ProductDetail = () => {
  const { id } = useParams();
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      console.log('Fetching product details for ID:', id);
      const items = await fetchEnvatoItems();
      const product = items.find(item => item.id === id);
      if (!product) {
        throw new Error("Product not found");
      }
      console.log('Found product:', product);
      return product;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">
              Error occurred
            </h2>
            <p className="mt-2 text-gray-600">
              Failed to fetch product details.
              <br />
              Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <ProductImage product={products} />
          <div>
            <ProductHeader product={products} />
            <ProductOptions basePrice={products?.price} />
          </div>
        </div>
        <ProductReviews productId={id || ""} />
        <SimilarProducts 
          currentProductId={id || ""}
          category={products?.category}
          priceRange={100}
        />
      </div>
    </div>
  );
};

export default ProductDetail;