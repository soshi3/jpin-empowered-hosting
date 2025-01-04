import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { PricingSection } from "@/components/PricingSection";
import { ContactForm } from "@/components/ContactForm";
import { FeaturesSection } from "@/components/FeaturesSection";
import { FaqSection } from "@/components/FaqSection";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchEnvatoItems } from "@/lib/envato-api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['envato-products'],
    queryFn: () => fetchEnvatoItems(),
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "エラー",
        description: error instanceof Error ? error.message : "商品の読み込み中にエラーが発生しました。",
      });
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
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive" className="max-w-lg mx-auto">
              <AlertDescription>
                {error instanceof Error ? error.message : "商品の読み込み中にエラーが発生しました。"}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {products?.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
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