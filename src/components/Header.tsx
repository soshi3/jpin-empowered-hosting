import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export const Header = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ja' : 'en');
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/b417115b-97e7-4aed-8f4c-6dbe9e1760ee.png" 
            alt="JPIN Solutions" 
            className="h-8 w-auto"
          />
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-primary transition-colors">
            {t('home')}
          </Link>
          <Link to="/products" className="hover:text-primary transition-colors">
            {t('products')}
          </Link>
          <Link to="/contact" className="hover:text-primary transition-colors">
            {t('contact')}
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleLanguage}>
            <Globe className="h-5 w-5" />
            <span className="ml-2 font-bold">{language.toUpperCase()}</span>
          </Button>
          <Button variant="default">
            {t('contactUs')}
          </Button>
        </div>
      </div>
    </header>
  );
};