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
import { useState, useMemo } from "react";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SearchInput } from "@/components/SearchInput";
import { categorizeProducts } from "@/utils/categoryUtils";

const Index = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['envato-products'],
    queryFn: () => {
      console.log('Fetching Envato products...');
      return fetchEnvatoItems();
    },
    staleTime: 4 * 60 * 60 * 1000,
    gcTime: 4 * 60 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
    throwOnError: true,
    meta: {
      errorHandler: (error: Error) => {
        console.error('Error fetching Envato products:', error);
        toast({
          variant: "destructive",
          title: "エラー",
          description: error.message || "商品の読み込み中にエラーが発生しました。",
        });
      }
    }
  });

  const handleSearch = (query: string) => {
    console.log('Performing search with query:', query);
    setSearchQuery(query);
    toast({
      title: "検索実行",
      description: `「${query}」で検索しています...`,
    });
  };

  // 検索とカテゴリーフィルタリングを組み合わせた商品リストを生成
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    console.log('Total products before filtering:', products.length);
    console.log('Current search query:', searchQuery);
    
    let filtered = products;
    
    // 検索クエリがある場合のみフィルタリングを適用
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      filtered = products.filter(product => {
        const titleMatch = product.title?.toLowerCase().includes(query);
        const descriptionMatch = product.description?.toLowerCase().includes(query);
        const authorMatch = product.author?.toLowerCase().includes(query);
        const categoryMatch = product.category?.toLowerCase().includes(query);
        const tagsMatch = product.tags?.some(tag => 
          tag.toLowerCase().includes(query)
        );
        
        return titleMatch || descriptionMatch || authorMatch || categoryMatch || tagsMatch;
      });
      
      console.log('Products after search filtering:', filtered.length);
      
      if (filtered.length === 0) {
        toast({
          title: "検索結果",
          description: "該当する商品が見つかりませんでした。",
          variant: "destructive",
        });
      }
    }

    // カテゴリーフィルタリングを適用
    if (activeCategory !== "all") {
      const categorized = categorizeProducts(filtered);
      console.log(`Products in ${activeCategory} category:`, categorized[activeCategory]?.length || 0);
      return categorized[activeCategory] || [];
    }
    
    return filtered;
  }, [products, searchQuery, activeCategory]);

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
              <Button size="lg" variant="default" className="bg-white text-primary hover:bg-white/90 shadow-lg">
                プランを見る
                <ArrowRight className="ml-2" />
              </Button>
              <Button 
                size="lg" 
                className="bg-blue-600 text-white border-2 border-transparent hover:bg-blue-700 shadow-lg transition-all"
              >
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
              <SearchInput 
                value={searchQuery} 
                onChange={setSearchQuery}
                onSearch={handleSearch}
              />
              <CategoryFilter onCategoryChange={setActiveCategory} />

              <div className="grid md:grid-cols-3 gap-8">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))
                ) : (
                  <p className="col-span-3 text-center text-muted-foreground py-8">
                    {searchQuery ? "検索条件に一致する商品が見つかりませんでした。" : "商品の読み込み中..."}
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
