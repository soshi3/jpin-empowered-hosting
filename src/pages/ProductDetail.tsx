import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { PricingSection } from "@/components/PricingSection";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { fetchEnvatoItems } from "@/lib/envato-api";
import { useState, useEffect } from "react";

const ProductDetail = () => {
  const { id } = useParams();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

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
      return {
        ...product,
        image: typeof product.image === 'object' && product.image !== null ? 
          product.image.value : product.image // Safely handle both object and string cases
      };
    },
  });

  useEffect(() => {
    if (products?.image) {
      console.log('Attempting to load image:', products.image);
      const img = new Image();
      img.onload = () => {
        console.log('Product image loaded successfully:', products.image);
        setImageLoading(false);
        setImageError(false);
      };
      img.onerror = () => {
        console.error('Failed to load product image:', products.image);
        setImageError(true);
        setImageLoading(false);
      };
      img.src = products.image;
      img.crossOrigin = "anonymous";

      return () => {
        img.onload = null;
        img.onerror = null;
      };
    }
  }, [products?.image]);

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
            <h2 className="text-2xl font-bold text-red-600">エラーが発生しました</h2>
            <p className="mt-2 text-gray-600">商品の取得に失敗しました。時間をおいて再度お試しください。</p>
          </div>
        </div>
      </div>
    );
  }

  const product = products;
  const fallbackImage = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80";

  if (!product?.image) {
    console.error('No image URL found for product:', product);
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="relative">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            <img
              src={imageError ? fallbackImage : product?.image}
              alt={product?.title}
              className={`w-full rounded-lg shadow-lg transition-opacity duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              crossOrigin="anonymous"
              onError={() => {
                console.error('Error loading image, falling back to placeholder');
                setImageError(true);
                setImageLoading(false);
              }}
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-4">{product?.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{product?.description}</p>
            <p className="text-3xl font-bold text-primary mb-8">
              ¥{product?.price?.toLocaleString()}
            </p>
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">主な機能</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-secondary rounded-full mr-2" />
                  {product?.description}
                </li>
              </ul>
            </div>
            <Button size="lg" className="w-full md:w-auto">
              購入する
            </Button>
          </div>
        </div>
      </div>

      <PricingSection />
    </div>
  );
};

export default ProductDetail;