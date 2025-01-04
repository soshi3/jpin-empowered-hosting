import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { ProcessedItem } from "@/lib/types/envato";

interface ProductImageProps {
  product?: ProcessedItem;
}

export const ProductImage = ({ product }: ProductImageProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const fallbackImage = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80";

  useEffect(() => {
    if (product?.image) {
      console.log('Loading product image:', product.image);
      const img = new Image();
      img.onload = () => {
        console.log('Product image loaded successfully');
        setImageLoading(false);
        setImageError(false);
      };
      img.onerror = () => {
        console.error('Failed to load product image:', product.image);
        setImageError(true);
        setImageLoading(false);
      };
      img.src = product.image;

      return () => {
        img.onload = null;
        img.onerror = null;
      };
    } else {
      setImageLoading(false);
      setImageError(true);
    }
  }, [product?.image]);

  return (
    <div className="relative">
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <img
        src={imageError || !product?.image ? fallbackImage : product.image}
        alt={product?.title || '商品画像'}
        className={`w-full rounded-lg shadow-lg transition-opacity duration-300 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onError={() => {
          console.error('Error loading image, falling back to placeholder');
          setImageError(true);
          setImageLoading(false);
        }}
      />
    </div>
  );
};