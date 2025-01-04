import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { PricingSection } from "@/components/PricingSection";
import { ContactForm } from "@/components/ContactForm";
import { FeaturesSection } from "@/components/FeaturesSection";
import { FaqSection } from "@/components/FaqSection";
import { ArrowRight, AlertCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchEnvatoItems } from "@/lib/envato-api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

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
              <Loader className="w-8 h-8 animate-spin text-primary" />
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
            <div className="grid md:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
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