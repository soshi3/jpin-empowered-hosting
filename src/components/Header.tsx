import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getRandomGradient } from "@/utils/colorUtils";

export const Header = () => {
  const [gradient, setGradient] = useState("");

  useEffect(() => {
    setGradient(getRandomGradient());
  }, []);

  return (
    <header className={`${gradient} transition-colors duration-500`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/713b48c3-48a4-4835-bbe2-53adcfaa0f40.png" 
            alt="JPIN Solutions" 
            className="h-10 w-auto"
          />
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-white hover:text-white/90 transition-colors">
            Home
          </Link>
          <Link to="/products" className="text-white hover:text-white/90 transition-colors">
            Products
          </Link>
          <Link to="/contact" className="text-white hover:text-white/90 transition-colors">
            Contact
          </Link>
        </nav>
        <Button variant="default" className="bg-white text-primary hover:bg-white/90">
          Contact Us
        </Button>
      </div>
    </header>
  );
};