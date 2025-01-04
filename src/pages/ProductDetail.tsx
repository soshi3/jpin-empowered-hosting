import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { PricingSection } from "@/components/PricingSection";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await fetch(`https://api.envato.com/v3/market/catalog/item?id=${id}`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_ENVATO_API_KEY}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }
      return response.json();
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

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <img
              src={product?.preview_url}
              alt={product?.name}
              className="w-full rounded-lg shadow-lg"
              crossOrigin="anonymous"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-4">{product?.name}</h1>
            <p className="text-xl text-gray-600 mb-6">{product?.description}</p>
            <p className="text-3xl font-bold text-primary mb-8">
              ¥{(product?.price_cents / 100).toLocaleString()}
            </p>
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">主な機能</h3>
              <ul className="space-y-2">
                {product?.features?.map((feature: string) => (
                  <li key={feature} className="flex items-center">
                    <span className="w-2 h-2 bg-secondary rounded-full mr-2" />
                    {feature}
                  </li>
                ))}
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