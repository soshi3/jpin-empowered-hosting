import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/713b48c3-48a4-4835-bbe2-53adcfaa0f40.png" 
            alt="JPIN Solutions" 
            className="h-10 w-auto"
          />
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/products" className="hover:text-primary transition-colors">
            Products
          </Link>
          <Link to="/contact" className="hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>
        <Button variant="default">
          Contact Us
        </Button>
      </div>
    </header>
  );
};