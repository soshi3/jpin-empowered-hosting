import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const PricingSection = () => {
  const plans = [
    {
      name: "スタンダード",
      price: 9800,
      features: [
        "基本ホスティング",
        "SSL証明書",
        "メールサポート",
        "月次レポート",
      ],
    },
    {
      name: "プロフェッショナル",
      price: 29800,
      features: [
        "高性能ホスティング",
        "SSL証明書",
        "24/7サポート",
        "月次レポート",
        "セキュリティ監視",
        "バックアップ",
      ],
    },
    {
      name: "エンタープライズ",
      price: 98000,
      features: [
        "専用サーバー",
        "SSL証明書",
        "24/7優先サポート",
        "週次レポート",
        "セキュリティ監視",
        "自動バックアップ",
        "カスタマイズ可能",
      ],
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">ホスティングプラン</h2>
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