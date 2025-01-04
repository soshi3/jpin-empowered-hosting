import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { PricingSection } from "@/components/PricingSection";
import { ContactForm } from "@/components/ContactForm";
import { FeaturesSection } from "@/components/FeaturesSection";
import { FaqSection } from "@/components/FaqSection";
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchEnvatoItems } from "@/lib/api/envato";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo, useEffect } from "react";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SearchInput } from "@/components/SearchInput";
import { categorizeProducts } from "@/utils/categoryUtils";
import { Badge } from "@/components/ui/badge";

const ITEMS_PER_PAGE = 12;

const Index = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [loadTime, setLoadTime] = useState<number | null>(null);
  
  const startTime = useMemo(() => performance.now(), []);

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
          title: "Error",
          description: error.message || "An error occurred while loading products.",
        });
      }
    }
  });

  useEffect(() => {
    if (products && !isLoading) {
      const endTime = performance.now();
      const timeInMs = endTime - startTime;
      setLoadTime(timeInMs);
      console.log(`Products loaded in ${timeInMs.toFixed(2)}ms`);
      console.log('Total products loaded:', products.length);
    }
  }, [products, isLoading, startTime]);

  const handleSearch = (query: string) => {
    console.log('Performing search with query:', query);
    setSearchQuery(query);
    setPage(1);
  };

  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) {
      console.log('No products available for filtering');
      return [];
    }
    
    console.log('Filtering products...');
    console.log('Total products before filtering:', products.length);
    console.log('Current search query:', searchQuery);
    console.log('Current category:', activeCategory);
    
    let filtered = products;
    
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      filtered = products.filter(product => {
        const titleMatch = product.title?.toLowerCase().includes(query);
        const descriptionMatch = product.description?.toLowerCase().includes(query);
        return titleMatch || descriptionMatch;
      });
      
      console.log('Products after search filtering:', filtered.length);
    }

    if (activeCategory !== "all") {
      const categorized = categorizeProducts(filtered);
      console.log(`Products in ${activeCategory} category:`, categorized[activeCategory]?.length || 0);
      filtered = categorized[activeCategory] || [];
    }
    
    console.log('Final filtered products count:', filtered.length);
    return filtered;
  }, [products, searchQuery, activeCategory]);

  const paginatedProducts = useMemo(() => {
    if (!filteredProducts.length) {
      console.log('No products to paginate');
      return [];
    }
    
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedItems = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    console.log(`Paginated products: showing ${paginatedItems.length} items from index ${startIndex}`);
    return paginatedItems;
  }, [filteredProducts, page]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  // Reset page when category or search changes
  useEffect(() => {
    setPage(1);
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Professional<br />Hosting Solutions
            </h1>
            <p className="text-xl mb-8 text-white/90">
              One-stop solution for Codecanyon products<br />with high-quality hosting and maintenance
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="default" className="bg-white text-primary hover:bg-white/90 shadow-lg">
                View Plans
                <ArrowRight className="ml-2" />
              </Button>
              <Button 
                size="lg" 
                className="bg-blue-600 text-white border-2 border-transparent hover:bg-blue-700 shadow-lg transition-all"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      <FeaturesSection />

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-12">
            <h2 className="text-3xl font-bold text-center">Featured Products</h2>
            {!isLoading && products && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  Total {products.length} items
                </Badge>
                {loadTime && (
                  <Badge variant="outline" className="text-sm">
                    Loaded in {loadTime.toFixed(0)}ms
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <SearchInput 
              value={searchQuery} 
              onChange={setSearchQuery}
              onSearch={handleSearch}
            />
            <CategoryFilter onCategoryChange={setActiveCategory} />

            {isLoading ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : error ? (
              <Alert variant="destructive" className="max-w-lg mx-auto">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="ml-2">
                  {error instanceof Error ? error.message : "An error occurred while loading products."}
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {filteredProducts.length > 0 ? (
                  <>
                    <div className="grid md:grid-cols-3 gap-8">
                      {paginatedProducts.map((product) => (
                        <ProductCard key={product.id} {...product} />
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex justify-center gap-2 mt-8">
                        <Button
                          variant="outline"
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1}
                        >
                          Previous
                        </Button>
                        <span className="flex items-center px-4">
                          Page {page} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground mb-4">
                      {searchQuery 
                        ? `「${searchQuery}」に一致する商品が見つかりませんでした。` 
                        : activeCategory !== 'all'
                          ? `${activeCategory}カテゴリーの商品が見つかりませんでした。`
                          : "商品が見つかりませんでした。"}
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('all');
                      }}
                    >
                      すべての商品を表示
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <PricingSection />
      <FaqSection />

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
          <ContactForm />
        </div>
      </section>
    </div>
  );
};

export default Index;