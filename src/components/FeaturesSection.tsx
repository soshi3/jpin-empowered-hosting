import { Server, Shield, Clock, Headphones } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Server,
      title: "High Performance Server",
      description: "Stable hosting with latest infrastructure",
    },
    {
      icon: Shield,
      title: "Security Measures",
      description: "24/7 security monitoring and protection",
    },
    {
      icon: Clock,
      title: "Quick Implementation",
      description: "Start service immediately after purchase",
    },
    {
      icon: Headphones,
      title: "Expert Support",
      description: "Technical support by experienced engineers",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Service Features</h2>
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