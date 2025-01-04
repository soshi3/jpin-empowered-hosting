import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { PricingSection } from "@/components/PricingSection";
import { ContactForm } from "@/components/ContactForm";
import { FeaturesSection } from "@/components/FeaturesSection";
import { FaqSection } from "@/components/FaqSection";
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchEnvatoItems } from "@/lib/envato-api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { PRODUCT_CATEGORIES } from "@/lib/types/categories";
import { cn } from "@/lib/utils";

const Index = () => {
  const { toast } = useToast();
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['envato-products'],
    queryFn: () => fetchEnvatoItems(),
    meta: {
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "エラー",
          description: error.message || "商品の読み込み中にエラーが発生しました。",
        });
      }
    }
  });

  console.log('Products data:', products);
  console.log('Error:', error);

  // 商品をカテゴリーに分類する関数
  const categorizeProducts = (products: any[]) => {
    if (!products) return {};
    
    return products.reduce((acc: Record<string, any[]>, product) => {
      // タイトルとdescriptionに基づいて詳細なカテゴリー分類
      let category = 'web-app'; // デフォルトカテゴリー
      const titleLower = product.title.toLowerCase();
      const descLower = product.description.toLowerCase();
      
      if (titleLower.includes('landing') || titleLower.includes('lp')) {
        category = 'landing-page';
      } else if (titleLower.includes('admin') || titleLower.includes('dashboard')) {
        category = 'dashboard';
      } else if (titleLower.includes('shop') || titleLower.includes('ecommerce') || titleLower.includes('store')) {
        category = 'ecommerce';
      } else if (titleLower.includes('community') || titleLower.includes('social') || titleLower.includes('forum')) {
        category = 'community';
      } else if (titleLower.includes('business') || titleLower.includes('corporate')) {
        category = 'business';
      } else if (titleLower.includes('developer') || titleLower.includes('api') || descLower.includes('developer')) {
        category = 'developer';
      } else if (titleLower.includes('design') || titleLower.includes('ui kit') || descLower.includes('design')) {
        category = 'design';
      }
      
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              プロフェッショナルな<br />ホスティングソリューション
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Codecanyonの商品と高品質なホスティング・保守運用を<br />ワンストップで提供
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="default" className="bg-white text-primary hover:bg-white/90">
                プランを見る
                <ArrowRight className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                お問い合わせ
              </Button>
            </div>
          </div>
        </div>
      </section>

      <FeaturesSection />

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">おすすめ商品</h2>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground">商品を読み込み中...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive" className="max-w-lg mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                {error instanceof Error ? error.message : "商品の読み込み中にエラーが発生しました。"}
              </AlertDescription>
            </Alert>
          ) : products && products.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                <Button
                  variant="outline"
                  className={cn(
                    "flex flex-col items-center gap-2 h-auto py-4 hover:bg-primary hover:text-primary-foreground",
                    "all" === "all" && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => window.location.hash = "#all"}
                >
                  <ArrowRight className="w-6 h-6" />
                  <span className="text-sm">すべて</span>
                </Button>
                {PRODUCT_CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  const isActive = window.location.hash === `#${category.id}`;
                  return (
                    <Button
                      key={category.id}
                      variant="outline"
                      className={cn(
                        "flex flex-col items-center gap-2 h-auto py-4 hover:bg-primary hover:text-primary-foreground",
                        isActive && "bg-primary text-primary-foreground"
                      )}
                      onClick={() => window.location.hash = `#${category.id}`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-sm">{category.name}</span>
                    </Button>
                  );
                })}
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {(!window.location.hash || window.location.hash === "#all" ? products : 
                  categorizeProducts(products)[window.location.hash.slice(1)] || []
                ).map((product: any) => (
                  <ProductCard key={product.id} {...product} />
                ))}
                {window.location.hash && window.location.hash !== "#all" && 
                 (!categorizeProducts(products)[window.location.hash.slice(1)] || 
                  categorizeProducts(products)[window.location.hash.slice(1)].length === 0) && (
                  <p className="col-span-3 text-center text-muted-foreground py-8">
                    このカテゴリーの商品は現在ありません。
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              商品が見つかりませんでした。
            </div>
          )}
        </div>
      </section>

      <PricingSection />
      <FaqSection />

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">お問い合わせ</h2>
          <ContactForm />
        </div>
      </section>
    </div>
  );
};

export default Index;