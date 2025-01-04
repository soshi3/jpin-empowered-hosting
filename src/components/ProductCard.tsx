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
  const currentImage = imageError || !image ? getFallbackImage() : image;

  useEffect(() => {
    console.log(`Loading images for product ${id}:`, { image, additional_images, currentImage });
    setImageError(false);
    setIsLoading(true);

    if (!currentImage) {
      console.log(`No valid image URL for product ${id}, using fallback`);
      setImageError(true);
      setIsLoading(false);
      return;
    }

    const loadImages = async () => {
      try {
        await Promise.all(
          allImages.map((imageUrl) => {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = () => {
                console.log(`Successfully loaded image: ${imageUrl}`);
                resolve(null);
              };
              img.onerror = (error) => {
                console.error(`Failed to load image: ${imageUrl}`, error);
                reject(error);
              };
              img.src = imageUrl;
            });
          })
        );
        console.log(`All images loaded successfully for product ${id}`);
        setIsLoading(false);
      } catch (error) {
        console.error(`Failed to load images for product ${id}:`, error);
        setImageError(true);
        setIsLoading(false);
      }
    };

    loadImages();
  }, [id, image, allImages, currentImage]);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <Link to={`/product/${id}`} className="relative aspect-video w-full bg-gray-100 block">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          {hasMultipleImages ? (
            <Carousel className="w-full">
              <CarouselContent>
                {allImages.map((img, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={imageError ? getFallbackImage() : img}
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
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>
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