import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

export const ProductCard = ({ id, title, description, price, image }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.error(`Failed to load image for product ${id}:`, image);
    setImageError(true);
  };

  // Unsplashのプレースホルダー画像を使用
  const fallbackImage = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&q=80";

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <img
            src={imageError ? fallbackImage : image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={handleImageError}
            loading="lazy"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-2 line-clamp-1">{title}</CardTitle>
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