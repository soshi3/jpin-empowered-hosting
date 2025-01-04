import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const PricingSection = () => {
  const plans = [
    {
      name: "Hosting",
      price: 9800,
      features: [
        "High Performance Server",
        "SSL Certificate",
        "Email Support",
        "Monthly Report",
        "Automatic Backup",
      ],
    },
    {
      name: "Maintenance",
      price: 29800,
      features: [
        "24/7 Monitoring",
        "Security Measures",
        "Technical Support",
        "Regular Updates",
        "Performance Optimization",
        "Issue Resolution",
      ],
    },
    {
      name: "Full Support",
      price: 35800,
      features: [
        "All Hosting Features",
        "All Maintenance Features",
        "Priority Support",
        "Customization Support",
        "Regular Meetings",
        "Dedicated Manager",
      ],
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Support Plans</h2>
        <p className="text-center text-gray-600 mb-12">Can be added as options when purchasing products</p>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.name} className="relative overflow-hidden">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <p className="text-3xl font-bold mt-4">
                  ¥{plan.price.toLocaleString()}<span className="text-sm font-normal">/month</span>
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
                <Button className="w-full mt-8">Subscribe</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};