import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export const ContactForm = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "送信完了",
      description: "お問い合わせありがとうございます。担当者より連絡させていただきます。",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
      <div>
        <label htmlFor="name" className="block mb-2">
          お名前
        </label>
        <Input id="name" required />
      </div>
      <div>
        <label htmlFor="email" className="block mb-2">
          メールアドレス
        </label>
        <Input id="email" type="email" required />
      </div>
      <div>
        <label htmlFor="message" className="block mb-2">
          お問い合わせ内容
        </label>
        <Textarea id="message" required className="min-h-[150px]" />
      </div>
      <Button type="submit" className="w-full">
        送信する
      </Button>
    </form>
  );
};