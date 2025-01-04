import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { PricingSection } from "@/components/PricingSection";
import { ContactForm } from "@/components/ContactForm";
import { FeaturesSection } from "@/components/FeaturesSection";
import { FaqSection } from "@/components/FaqSection";
import { CategorySection } from "@/components/CategorySection";
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchEnvatoItems } from "@/lib/envato-api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useRef, useCallback } from "react";

const Index = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey: ['envato-products', selectedCategory],
    queryFn: ({ pageParam = 1 }) => 
      fetchEnvatoItems(
        selectedCategory === "all" ? "wordpress" : `wordpress ${selectedCategory}`,
        pageParam
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.currentPage + 1 : undefined;
    },
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

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
      console.log('Intersection observed, loading more items...');
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [handleObserver]);

  const allProducts = data?.pages.flatMap(page => page.items) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with reordered layers */}
      <section className="relative min-h-[600px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
          <div className="stripe-gradient" />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
              プロフェッショナルな<br />ホスティングソリューション
            </h1>
            <p className="text-xl mb-8 text-white/95 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
              Codecanyonの商品と高品質なホスティング・保守運用を<br />ワンストップで提供
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg" 
                variant="default" 
                className="bg-white text-primary hover:bg-white/90 shadow-lg"
              >
                プランを見る
                <ArrowRight className="ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 shadow-lg backdrop-blur-sm"
              >
                お問い合わせ
              </Button>
            </div>
          </div>
        </div>
      </section>

      <FeaturesSection />

      {/* Categories and Products Section */}
      <section className="py-16 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <CategorySection 
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
          
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">おすすめ商品</h2>
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
          ) : allProducts.length > 0 ? (
            <>
              <div className="grid md:grid-cols-3 gap-8">
                {allProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
              <div
                ref={loadMoreRef}
                className="py-8 flex justify-center"
              >
                {isFetchingNextPage ? (
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                ) : hasNextPage ? (
                  <p className="text-muted-foreground">スクロールして続きを読み込む</p>
                ) : (
                  <p className="text-muted-foreground">すべての商品を表示しました</p>
                )}
              </div>
            </>
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
      <section className="py-16 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">お問い合わせ</h2>
          <ContactForm />
        </div>
      </section>
    </div>
  );
};

export default Index;