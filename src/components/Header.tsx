import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Globe, Moon, Sun, Server } from "lucide-react";

export const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ja' : 'en');
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <Server
            key={i}
            className="absolute text-primary"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
            size={48 + Math.random() * 48}
          />
        ))}
      </div>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center relative z-10">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/86055be1-5c14-4fef-a32c-32eb9b88e5da.png" 
            alt="JPIN Solutions" 
            className="h-12 w-auto"
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
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
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