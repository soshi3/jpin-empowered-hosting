import { Badge } from "@/components/ui/badge";
import { Package, Star } from "lucide-react";
import { ProcessedItem } from "@/lib/types/envato";

interface ProductHeaderProps {
  product?: ProcessedItem;
}

export const ProductHeader = ({ product }: ProductHeaderProps) => {
  // Format description to remove excessive line breaks
  const formatDescription = (text: string = '') => {
    // First, normalize line endings
    const normalizedText = text.replace(/\r\n/g, '\n');
    // Replace 3 or more consecutive line breaks with 2 line breaks
    return normalizedText.replace(/\n{3,}/g, '\n\n');
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-4xl font-bold">
          {product?.title}
        </h1>
        <Badge variant="secondary">
          <Package className="w-4 h-4 mr-2" />
          Product
        </Badge>
        {product?.rating && (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
            {product.rating.toFixed(1)}
          </Badge>
        )}
      </div>
      
      <p className="text-xl text-gray-600 mb-8 whitespace-pre-line">
        {formatDescription(product?.description)}
      </p>
    </>
  );
};