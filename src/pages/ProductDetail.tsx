import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ExternalLink } from "lucide-react";
import { fetchEnvatoItems } from "@/lib/envato-api";
import { ProductImage } from "@/components/ProductImage";
import { ProductOptions } from "@/components/ProductOptions";
import { ProductHeader } from "@/components/ProductHeader";
import { ProductReviews } from "@/components/ProductReviews";
import { SimilarProducts } from "@/components/SimilarProducts";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const ProductDetail = () => {
  const { id } = useParams();
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">
              An error occurred
            </h2>
            <p className="mt-2 text-gray-600">
              Failed to fetch product details.
              <br />
              Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-8">
            <ProductImage product={products} />
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Product Information</h3>
              <dl className="space-y-4">
                {products?.author && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Author</dt>
                    <dd className="text-base">{products.author}</dd>
                  </div>
                )}
                {products?.sales !== undefined && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Total Sales</dt>
                    <dd className="text-base">{products.sales.toLocaleString()} sales</dd>
                  </div>
                )}
                {products?.category && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Category</dt>
                    <dd className="text-base">{products.category}</dd>
                  </div>
                )}
                {products?.tags && products.tags.length > 0 && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Tags</dt>
                    <dd className="flex flex-wrap gap-2 mt-1">
                      {products.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {(products?.demo_url || products?.live_preview_url) && (
              <div className="p-6 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Demo & Preview</h3>
                <div className="space-y-3">
                  {products.demo_url && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open(products.demo_url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Demo
                    </Button>
                  )}
                  {products.live_preview_url && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open(products.live_preview_url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Preview
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-8">
            <ProductHeader product={products} />
            <ProductOptions basePrice={products?.price} />
          </div>
        </div>

        <Separator className="my-12" />
        
        <ProductReviews productId={id || ""} />
        
        <Separator className="my-12" />
        
        <SimilarProducts 
          currentProductId={id || ""}
          category={products?.category}
          priceRange={100}
        />
      </main>
    </div>
  );
};

export default ProductDetail;