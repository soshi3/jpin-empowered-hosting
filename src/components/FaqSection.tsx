import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FaqSection = () => {
  const faqs = [
    {
      question: "How long does implementation take?",
      answer: "Usually, service can start within 24 hours of application. For existing site migrations, timing may vary depending on content.",
    },
    {
      question: "What are the support hours?",
      answer: "Technical support is available on weekdays from 9:00-18:00. Emergency support is available 24/7.",
    },
    {
      question: "Is backup provided?",
      answer: "Yes, daily backups are provided as standard. More frequent backups can be arranged upon request.",
    },
    {
      question: "Can I use a custom domain?",
      answer: "Yes, you can use your own custom domain. We provide free SSL certificates.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};