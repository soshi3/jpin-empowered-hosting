import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Server, Shield } from "lucide-react";

interface ProductOptionsProps {
  selectedOptions: {
    hosting: boolean;
    maintenance: boolean;
  };
  setSelectedOptions: (options: { hosting: boolean; maintenance: boolean }) => void;
  totalPrice: number;
  basePrice?: number;
  onPurchase: () => void;
}

export const ProductOptions = ({
  selectedOptions,
  setSelectedOptions,
  totalPrice,
  basePrice,
  onPurchase
}: ProductOptionsProps) => {
  const handleHostingChange = (checked: boolean) => {
    setSelectedOptions({
      ...selectedOptions,
      hosting: checked
    });
  };

  const handleMaintenanceChange = (checked: boolean) => {
    setSelectedOptions({
      ...selectedOptions,
      maintenance: checked
    });
  };

  return (
    <>
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <Checkbox
                id="hosting"
                checked={selectedOptions.hosting}
                onCheckedChange={(checked) => handleHostingChange(checked === true)}
              />
              <div className="grid gap-1.5">
                <Label htmlFor="hosting" className="text-base font-semibold flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  ホスティング
                  <Badge variant="outline">$9,800/month</Badge>
                </Label>
                <p className="text-sm text-muted-foreground">
                  高性能サーバーでの安定したホスティングサービス
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Checkbox
                id="maintenance"
                checked={selectedOptions.maintenance}
                onCheckedChange={(checked) => handleMaintenanceChange(checked === true)}
              />
              <div className="grid gap-1.5">
                <Label htmlFor="maintenance" className="text-base font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  保守運用
                  <Badge variant="outline">$29,800/month</Badge>
                </Label>
                <p className="text-sm text-muted-foreground">
                  24時間365日の監視と技術サポート
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-gray-600">商品価格</p>
          <p className="text-3xl font-bold text-primary">
            ${basePrice?.toLocaleString()}
          </p>
        </div>
        {(selectedOptions.hosting || selectedOptions.maintenance) && (
          <div className="text-right">
            <p className="text-sm text-gray-600">オプション込み合計</p>
            <p className="text-3xl font-bold text-primary">
              ${totalPrice.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      <Button size="lg" className="w-full" onClick={onPurchase}>
        購入する
      </Button>
    </>
  );
};