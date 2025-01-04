import { Server, Shield, Clock, Headphones } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Server,
      title: "高性能サーバー",
      description: "最新のインフラで安定したホスティングを提供",
    },
    {
      icon: Shield,
      title: "セキュリティ対策",
      description: "24時間365日のセキュリティ監視と対策",
    },
    {
      icon: Clock,
      title: "迅速な導入",
      description: "購入後すぐにサービスを開始可能",
    },
    {
      icon: Headphones,
      title: "専門サポート",
      description: "経験豊富なエンジニアによる技術サポート",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">サービスの特徴</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-primary/10 rounded-full">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};