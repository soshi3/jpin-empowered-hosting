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
import { ProcessedItem } from "@/lib/types/envato";

const ProductDetail = () => {
  const { id } = useParams();
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      console.log('Fetching product details for ID:', id);
      const items = await fetchEnvatoItems();
      const foundProduct = items.find(item => item.id === id);
      if (!foundProduct) {
        throw new Error("Product not found");
      }
      console.log('Found product:', foundProduct);
      return foundProduct as ProcessedItem;
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

  if (error || !product) {
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

  const hasPreviewLinks = product.demo_url || product.live_preview_url;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-8">
            <ProductImage product={product} />
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Product Information</h3>
              <dl className="space-y-4">
                {product.author && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Author</dt>
                    <dd className="text-base">{product.author}</dd>
                  </div>
                )}
                {product.sales !== undefined && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Total Sales</dt>
                    <dd className="text-base">{product.sales.toLocaleString()} sales</dd>
                  </div>
                )}
                {product.category && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Category</dt>
                    <dd className="text-base">{product.category}</dd>
                  </div>
                )}
                {product.tags && product.tags.length > 0 && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Tags</dt>
                    <dd className="flex flex-wrap gap-2 mt-1">
                      {product.tags.map((tag, index) => (
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

            {hasPreviewLinks && (
              <div className="p-6 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Demo & Preview</h3>
                <div className="space-y-3">
                  {product.demo_url && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open(product.demo_url || '', '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Demo
                    </Button>
                  )}
                  {product.live_preview_url && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open(product.live_preview_url || '', '_blank')}
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
            <ProductHeader product={product} />
            <ProductOptions basePrice={product.price} />
          </div>
        </div>

        <Separator className="my-12" />
        
        <ProductReviews productId={id || ""} />
        
        <Separator className="my-12" />
        
        <SimilarProducts 
          currentProductId={id || ""}
          category={product.category}
          priceRange={100}
        />
      </main>
    </div>
  );
};

export default ProductDetail;