import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Package, Server, Shield, Check } from "lucide-react";
import { fetchEnvatoItems } from "@/lib/envato-api";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
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

  useEffect(() => {
    if (products?.image) {
      console.log('Loading product image:', products.image);
      const img = new Image();
      img.onload = () => {
        console.log('Product image loaded successfully');
        setImageLoading(false);
        setImageError(false);
      };
      img.onerror = () => {
        console.error('Failed to load product image:', products.image);
        setImageError(true);
        setImageLoading(false);
      };
      img.src = products.image;

      return () => {
        img.onload = null;
        img.onerror = null;
      };
    } else {
      setImageLoading(false);
      setImageError(true);
    }
  }, [products?.image]);

  const fallbackImage = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80";

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

  const product = products;

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
              src={imageError || !product?.image ? fallbackImage : product.image}
              alt={product?.title || '商品画像'}
              className={`w-full rounded-lg shadow-lg transition-opacity duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onError={() => {
                console.error('Error loading image, falling back to placeholder');
                setImageError(true);
                setImageLoading(false);
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-4xl font-bold">
                {product?.title}
              </h1>
              <Badge variant="secondary">
                <Package className="w-4 h-4 mr-2" />
                商品
              </Badge>
            </div>
            
            <p className="text-xl text-gray-600 mb-8 whitespace-pre-line">
              {product?.description?.split('. ').join('.\n')}
            </p>

            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Checkbox
                      id="hosting"
                      checked={selectedOptions.hosting}
                      onCheckedChange={(checked) => 
                        setSelectedOptions(prev => ({ ...prev, hosting: checked === true }))
                      }
                    />
                    <div className="grid gap-1.5">
                      <Label htmlFor="hosting" className="text-base font-semibold flex items-center gap-2">
                        <Server className="w-4 h-4" />
                        ホスティング
                        <Badge variant="outline">¥9,800/月</Badge>
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        高性能サーバーでの安定したホスティングサービス
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Checkbox
                      id="maintenance"
                      checked={selectedOptions.maintenance}
                      onCheckedChange={(checked) => 
                        setSelectedOptions(prev => ({ ...prev, maintenance: checked === true }))
                      }
                    />
                    <div className="grid gap-1.5">
                      <Label htmlFor="maintenance" className="text-base font-semibold flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        保守運用
                        <Badge variant="outline">¥29,800/月</Badge>
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        24時間365日の監視と技術サポート
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-sm text-gray-600">商品価格</p>
                <p className="text-3xl font-bold text-primary">
                  ¥{product?.price?.toLocaleString()}
                </p>
              </div>
              {(selectedOptions.hosting || selectedOptions.maintenance) && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">オプション込み合計</p>
                  <p className="text-3xl font-bold text-primary">
                    ¥{calculateTotalPrice().toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            <Button size="lg" className="w-full" onClick={handlePurchase}>
              購入する
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;