import { useState, useEffect } from "react";
import { Shield, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface ProductOptionsProps {
  basePrice?: number;
}

export const ProductOptions = ({ basePrice = 0 }: ProductOptionsProps) => {
  const { toast } = useToast();
  const [selectedOptions, setSelectedOptions] = useState({
    hosting: false,
    maintenance: false,
  });

  const [totalPrice, setTotalPrice] = useState(basePrice);

  useEffect(() => {
    let total = basePrice;
    if (selectedOptions.hosting) total += 9800;
    if (selectedOptions.maintenance) total += 29800;
    setTotalPrice(total);
  }, [selectedOptions, basePrice]);

  const handlePurchase = () => {
    toast({
      title: "Purchase Initiated",
      description: "Redirecting to payment page...",
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hosting"
            checked={selectedOptions.hosting}
            onCheckedChange={(checked) =>
              setSelectedOptions((prev) => ({
                ...prev,
                hosting: checked === true,
              }))
            }
          />
          <div className="grid gap-1.5 leading-none">
            <div className="flex items-center gap-2">
              <Label htmlFor="hosting" className="text-base font-semibold flex items-center gap-2">
                <Server className="w-4 h-4" />
                Hosting
                <Badge variant="outline">${9,800}/month</Badge>
              </Label>
              <p className="text-sm text-muted-foreground">
                Stable hosting service on high-performance servers
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="maintenance"
            checked={selectedOptions.maintenance}
            onCheckedChange={(checked) =>
              setSelectedOptions((prev) => ({
                ...prev,
                maintenance: checked === true,
              }))
            }
          />
          <div className="grid gap-1.5 leading-none">
            <div className="flex items-center gap-2">
              <Label htmlFor="maintenance" className="text-base font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Maintenance
                <Badge variant="outline">${29,800}/month</Badge>
              </Label>
              <p className="text-sm text-muted-foreground">
                24/7 monitoring and technical support
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between border-t pt-4">
        <div>
          <p className="text-sm text-gray-600">Product Price</p>
          <p className="text-3xl font-bold text-primary">
            ${basePrice?.toLocaleString()}
          </p>
        </div>
        {(selectedOptions.hosting || selectedOptions.maintenance) && (
          <div className="text-right">
            <p className="text-sm text-gray-600">Total with Options</p>
            <p className="text-3xl font-bold text-primary">
              ${totalPrice.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      <Button onClick={handlePurchase} className="w-full">
        Purchase Now
      </Button>
    </div>
  );
};