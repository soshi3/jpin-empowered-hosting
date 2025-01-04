import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { PricingSection } from "@/components/PricingSection";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { fetchEnvatoItems } from "@/lib/envato-api";

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
            <h2 className="text-2xl font-bold text-red-600">エラーが発生しました</h2>
            <p className="mt-2 text-gray-600">商品の取得に失敗しました。時間をおいて再度お試しください。</p>
          </div>
        </div>
      </div>
    );
  }

  const product = products;

  if (!product?.image) {
    console.error('No image URL found for product:', product);
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            {product?.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="w-full rounded-lg shadow-lg"
                crossOrigin="anonymous"
                onError={(e) => {
                  console.error('Error loading image:', e);
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            ) : (
              <div className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">画像を読み込めませんでした</p>
              </div>
            )}
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