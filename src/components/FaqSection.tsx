import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FaqSection = () => {
  const faqs = [
    {
      question: "導入にどのくらい時間がかかりますか？",
      answer: "通常、お申し込みから24時間以内にサービスを開始できます。既存サイトの移行を含む場合は、内容により異なります。",
    },
    {
      question: "サポートの対応時間は？",
      answer: "平日9:00-18:00の技術サポートを提供しています。緊急時は24時間365日対応可能です。",
    },
    {
      question: "バックアップは提供されますか？",
      answer: "はい、日次バックアップを標準で提供しています。より頻繁なバックアップも別途ご相談可能です。",
    },
    {
      question: "独自ドメインは使えますか？",
      answer: "はい、お客様の独自ドメインをご利用いただけます。SSL証明書も無料で提供します。",
    },
  ];

  return (
    <section className="py-16 bg-background dark:bg-[#1A1F2C]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">よくある質問</h2>
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