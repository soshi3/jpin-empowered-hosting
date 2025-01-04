import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { PricingSection } from "@/components/PricingSection";

const ProductDetail = () => {
  const { id } = useParams();

  // 仮のデータ（後でEnvato APIから取得）
  const product = {
    id: "1",
    title: "WordPressテーマ",
    description: "モダンでレスポンシブなWordPressテーマ",
    price: 19800,
    image: "/placeholder.svg",
    features: [
      "レスポンシブデザイン",
      "カスタマイズ可能",
      "SEOフレンドリー",
      "高速読み込み",
      "多言語対応",
    ],
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <img
              src={product.image}
              alt={product.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{product.description}</p>
            <p className="text-3xl font-bold text-primary mb-8">
              ¥{product.price.toLocaleString()}
            </p>
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">主な機能</h3>
              <ul className="space-y-2">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <span className="w-2 h-2 bg-secondary rounded-full mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <Button size="lg" className="w-full md:w-auto">
              購入する
            </Button>
          </div>
        </div>
      </div>

      <PricingSection />
    </div>
  );
};

export default ProductDetail;