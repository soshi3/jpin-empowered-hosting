import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loader2, Package, Server, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string | null;
  additional_images?: string[] | null;
}

export const ProductCard = ({ id, title, description, price, image, additional_images = [] }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCarousel, setShowCarousel] = useState(false);

  // Filter out null/undefined values and ensure string type
  const allImages = [image, ...(additional_images || [])].filter((img): img is string => 
    typeof img === 'string' && img.length > 0
  );
  
  const hasMultipleImages = allImages.length > 1;

  const getFallbackImage = () => {
    const fallbackImages = [
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&q=80",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80",
    ];
    const index = parseInt(id, 10) % fallbackImages.length;
    return fallbackImages[index];
  };

  // Get current image URL with fallback
  const currentImage = imageError || !allImages[0] ? getFallbackImage() : allImages[0];

  useEffect(() => {
    console.log(`Loading images for product ${id}:`, { image, additional_images, currentImage });
    setImageError(false);
    setIsLoading(true);

    const img = new Image();
    img.onload = () => {
      console.log(`Successfully loaded main image for product ${id}`);
      setIsLoading(false);
    };
    img.onerror = () => {
      console.error(`Failed to load main image for product ${id}`);
      setImageError(true);
      setIsLoading(false);
    };
    img.src = currentImage;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [id, currentImage]);

  // Format description to remove excessive line breaks
  const formatDescription = (text: string) => {
    // Replace 3 or more consecutive line breaks with 2 line breaks
    return text.replace(/\n{3,}/g, '\n\n');
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <Link 
          to={`/product/${id}`} 
          className="relative aspect-video w-full bg-gray-100 block"
          onMouseEnter={() => setShowCarousel(true)}
          onMouseLeave={() => setShowCarousel(false)}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          {hasMultipleImages ? (
            <div className="relative w-full h-full">
              {!showCarousel ? (
                <img
                  src={currentImage}
                  alt={title}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    isLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onError={() => {
                    console.error(`Error loading main image for product ${id}`);
                    setImageError(true);
                  }}
                  loading="lazy"
                />
              ) : (
                <Carousel className="w-full h-full">
                  <CarouselContent>
                    {allImages.map((img, index) => (
                      <CarouselItem key={index}>
                        <img
                          src={img}
                          alt={`${title} - Image ${index + 1}`}
                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                            isLoading ? 'opacity-0' : 'opacity-100'
                          }`}
                          onError={() => {
                            console.error(`Error loading image ${index + 1} for product ${id}`);
                            setImageError(true);
                          }}
                          loading="lazy"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex" />
                  <CarouselNext className="hidden md:flex" />
                </Carousel>
              )}
              {hasMultipleImages && !showCarousel && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Badge variant="secondary" className="bg-white/80 hover:bg-white/90">
                    {allImages.length} 枚の画像
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            <img
              src={currentImage}
              alt={title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onError={() => {
                console.error(`Error loading main image for product ${id}`);
                setImageError(true);
              }}
              loading="lazy"
            />
          )}
        </Link>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="mb-2 line-clamp-1 text-lg">{title}</CardTitle>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 whitespace-pre-line">
              {formatDescription(description)}
            </p>
          </div>
          <Badge variant="secondary" className="shrink-0">
            <Package className="w-3 h-3 mr-1" />
            Product
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="bg-primary/5">
            <Server className="w-3 h-3 mr-1" />
            Hosting Available
          </Badge>
          <Badge variant="outline" className="bg-primary/5">
            <Shield className="w-3 h-3 mr-1" />
            Maintenance Available
          </Badge>
        </div>
        <p className="text-xl font-bold text-primary">${price.toLocaleString()}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/product/${id}`} className="w-full">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};