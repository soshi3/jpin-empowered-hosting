import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { ProcessedItem } from "@/lib/types/envato";

interface ProductHeaderProps {
  product?: ProcessedItem;
}

export const ProductHeader = ({ product }: ProductHeaderProps) => {
  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-4xl font-bold">
          {product?.title}
        </h1>
        <Badge variant="secondary">
          <Package className="w-4 h-4 mr-2" />
          商品
        </Badge>
      </div>
      
      <p className="text-xl text-gray-600 mb-8 whitespace-pre-line">
        {product?.description?.split('. ').join('.\n')}
      </p>
    </>
  );
};