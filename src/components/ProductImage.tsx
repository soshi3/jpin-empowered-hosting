import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { ProcessedItem } from "@/lib/types/envato";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductImageProps {
  product?: ProcessedItem;
}

export const ProductImage = ({ product }: ProductImageProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const fallbackImage = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80";

  const allImages = product ? [product.image, ...(product.additional_images || [])] : [];
  const hasMultipleImages = allImages.length > 1;

  useEffect(() => {
    if (!product?.image) {
      console.error('No image URL provided for product');
      setImageError(true);
      setImageLoading(false);
      return;
    }

    console.log('Loading product images:', allImages);
    const loadImages = async () => {
      try {
        await Promise.all(
          allImages.map((imageUrl) => {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = resolve;
              img.onerror = reject;
              img.src = imageUrl;
            });
          })
        );
        console.log('All product images loaded successfully');
        setImageLoading(false);
        setImageError(false);
      } catch (error) {
        console.error('Failed to load one or more product images:', error);
        setImageError(true);
        setImageLoading(false);
      }
    };

    loadImages();
  }, [product, allImages]);

  if (!product) {
    return (
      <div className="aspect-video w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (imageLoading) {
    return (
      <div className="aspect-video w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasMultipleImages) {
    return (
      <img
        src={imageError ? fallbackImage : product.image}
        alt={product.title}
        className="w-full rounded-lg shadow-lg"
        onError={() => {
          console.error('Error loading image, falling back to placeholder');
          setImageError(true);
        }}
      />
    );
  }

  return (
    <Carousel className="w-full relative">
      <CarouselContent>
        {allImages.map((image, index) => (
          <CarouselItem key={index}>
            <div className="aspect-video w-full relative">
              <img
                src={imageError ? fallbackImage : image}
                alt={`${product.title} - Image ${index + 1}`}
                className="w-full rounded-lg shadow-lg object-cover"
                onError={() => {
                  console.error('Error loading image, falling back to placeholder');
                  setImageError(true);
                }}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
      <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
    </Carousel>
  );
};