import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const PricingSection = () => {
  const plans = [
    {
      name: "ホスティング",
      price: 9800,
      features: [
        "高性能サーバー",
        "SSL証明書",
        "メールサポート",
        "月次レポート",
        "自動バックアップ",
      ],
    },
    {
      name: "保守運用",
      price: 29800,
      features: [
        "24/7監視",
        "セキュリティ対策",
        "技術サポート",
        "定期アップデート",
        "パフォーマンス最適化",
        "障害対応",
      ],
    },
    {
      name: "フルサポート",
      price: 35800,
      features: [
        "ホスティング全機能",
        "保守運用全機能",
        "優先サポート",
        "カスタマイズ対応",
        "定期ミーティング",
        "専任担当者",
      ],
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">サポートプラン</h2>
        <p className="text-center text-gray-600 mb-12">商品購入時にオプションとして追加できます</p>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.name} className="relative overflow-hidden">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <p className="text-3xl font-bold mt-4">
                  ¥{plan.price.toLocaleString()}<span className="text-sm font-normal">/月</span>
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-secondary mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-8">お申し込み</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};