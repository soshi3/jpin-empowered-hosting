import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Package, Server, Shield } from "lucide-react";
import { fetchEnvatoItems } from "@/lib/envato-api";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ProductImage } from "@/components/ProductImage";
import { ProductOptions } from "@/components/ProductOptions";
import { ProductHeader } from "@/components/ProductHeader";

const ProductDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [selectedOptions, setSelectedOptions] = useState({
    hosting: false,
    maintenance: false
  });

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

  const calculateTotalPrice = () => {
    let total = products?.price || 0;
    if (selectedOptions.hosting) total += 9800;
    if (selectedOptions.maintenance) total += 29800;
    return total;
  };

  const handlePurchase = () => {
    toast({
      title: "購入手続きを開始します",
      description: `選択されたオプション：${[
        "商品",
        selectedOptions.hosting && "ホスティング",
        selectedOptions.maintenance && "保守運用"
      ].filter(Boolean).join(", ")}`,
    });
  };

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
              エラーが発生しました
            </h2>
            <p className="mt-2 text-gray-600">
              商品の取得に失敗しました。
              <br />
              時間をおいて再度お試しください。
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
            <ProductOptions
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              totalPrice={calculateTotalPrice()}
              basePrice={products?.price}
              onPurchase={handlePurchase}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;