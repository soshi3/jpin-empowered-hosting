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
import { Badge } from "@/components/ui/badge";

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
          title: "Error",
          description: error.message || "An error occurred while loading products.",
        });
      }
    }
  });

  const handleSearch = (query: string) => {
    console.log('Performing search with query:', query);
    setSearchQuery(query);
    toast({
      title: "Search Executed",
      description: `Searching for "${query}"...`,
    });
  };

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    console.log('Total products before filtering:', products.length);
    console.log('Current search query:', searchQuery);
    
    let filtered = products;
    
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      filtered = products.filter(product => {
        const titleMatch = product.title?.toLowerCase().includes(query);
        const descriptionMatch = product.description?.toLowerCase().includes(query);
        return titleMatch || descriptionMatch;
      });
      
      console.log('Products after search filtering:', filtered.length);
      
      if (filtered.length === 0) {
        toast({
          title: "Search Results",
          description: "No products found matching your search.",
          variant: "destructive",
        });
      }
    }

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
              <Badge variant="secondary" className="text-sm">
                Total {products.length} items
              </Badge>
            )}
          </div>
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
                    {searchQuery ? "No products found matching your search criteria." : "Loading products..."}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              No products found.
            </div>
          )}
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