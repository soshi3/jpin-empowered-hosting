import { useState, useEffect } from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { ProcessedItem } from "@/lib/types/envato";
import { Button } from "./ui/button";

interface ProductImageProps {
  product?: ProcessedItem;
}

export const ProductImage = ({ product }: ProductImageProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fallbackImage = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80";

  const allImages = product ? [product.image, ...(product.additionalImages || [])] : [];
  const currentImage = allImages[currentImageIndex] || fallbackImage;
  const hasMultipleImages = allImages.length > 1;

  useEffect(() => {
    if (!currentImage) {
      console.error('No image URL provided for product');
      setImageError(true);
      setImageLoading(false);
      return;
    }

    console.log('Loading product image:', currentImage);
    const img = new Image();
    img.onload = () => {
      console.log('Product image loaded successfully');
      setImageLoading(false);
      setImageError(false);
    };
    img.onerror = () => {
      console.error('Failed to load product image:', currentImage);
      setImageError(true);
      setImageLoading(false);
    };
    img.src = currentImage;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [currentImage]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  if (!product) {
    return (
      <div className="aspect-video w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative">
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <img
        src={imageError ? fallbackImage : currentImage}
        alt={`${product.title} - Image ${currentImageIndex + 1}`}
        className={`w-full rounded-lg shadow-lg transition-opacity duration-300 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onError={() => {
          console.error('Error loading image, falling back to placeholder');
          setImageError(true);
          setImageLoading(false);
        }}
      />
      {hasMultipleImages && (
        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-white/80 hover:bg-white"
            onClick={previousImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="flex items-center justify-center px-2 py-1 bg-white/80 rounded-full text-sm">
            {currentImageIndex + 1} / {allImages.length}
          </span>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-white/80 hover:bg-white"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};