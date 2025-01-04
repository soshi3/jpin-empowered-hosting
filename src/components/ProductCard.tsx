import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

export const ProductCard = ({ id, title, description, price, image }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset states when image prop changes
    setImageError(false);
    setIsLoading(true);

    // Preload image
    const img = new Image();
    img.onload = () => {
      console.log(`Image loaded successfully for product ${id}:`, image);
      setIsLoading(false);
    };
    img.onerror = (error) => {
      console.error(`Failed to load image for product ${id}:`, image, error);
      setImageError(true);
      setIsLoading(false);
    };
    img.src = image;
    img.crossOrigin = "anonymous";

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [image, id]);

  const handleImageError = () => {
    console.error(`Fallback to error handler for product ${id}:`, image);
    setImageError(true);
    setIsLoading(false);
  };

  // テック関連の高品質なフォールバック画像を使用
  const fallbackImage = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&q=80";

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full bg-gray-100">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          <img
            src={imageError ? fallbackImage : image}
            alt={title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onError={handleImageError}
            loading="lazy"
            crossOrigin="anonymous"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-2 line-clamp-1 text-lg">{title}</CardTitle>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>
        <p className="text-xl font-bold text-primary">¥{price.toLocaleString()}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/product/${id}`} className="w-full">
          <Button className="w-full">詳細を見る</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};