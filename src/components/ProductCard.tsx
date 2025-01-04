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

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <img
          src={imageError ? "/placeholder.svg" : image}
          alt={title}
          className="w-full h-48 object-cover"
          onError={handleImageError}
          loading="lazy"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-2">{title}</CardTitle>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
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