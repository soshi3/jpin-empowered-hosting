import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { PricingSection } from "@/components/PricingSection";
import { ContactForm } from "@/components/ContactForm";

const Index = () => {
  // 仮のデータ（後でEnvato APIから取得）
  const products = [
    {
      id: "1",
      title: "WordPressテーマ",
      description: "モダンでレスポンシブなWordPressテーマ",
      price: 19800,
      image: "/placeholder.svg",
    },
    {
      id: "2",
      title: "ECサイトテンプレート",
      description: "高機能なECサイトテンプレート",
      price: 29800,
      image: "/placeholder.svg",
    },
    {
      id: "3",
      title: "ランディングページ",
      description: "コンバージョン重視のランディングページ",
      price: 15800,
      image: "/placeholder.svg",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            プロフェッショナルな<br />ホスティングソリューション
          </h1>
          <p className="text-xl mb-8">
            Codecanyonの商品と高品質なホスティング・保守運用をワンストップで提供
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">おすすめ商品</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      <PricingSection />

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">お問い合わせ</h2>
          <ContactForm />
        </div>
      </section>
    </div>
  );
};

export default Index;