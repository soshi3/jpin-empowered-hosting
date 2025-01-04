import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/jpin-logo.png" 
            alt="JPIN Solutions" 
            className="h-10 w-auto"
          />
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-primary transition-colors">
            ホーム
          </Link>
          <Link to="/products" className="hover:text-primary transition-colors">
            商品一覧
          </Link>
          <Link to="/contact" className="hover:text-primary transition-colors">
            お問い合わせ
          </Link>
        </nav>
        <Button variant="default">
          お問い合わせ
        </Button>
      </div>
    </header>
  );
};