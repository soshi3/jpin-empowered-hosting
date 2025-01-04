import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { FormEvent } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
}

export const SearchInput = ({ value, onChange, onSearch }: SearchInputProps) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', value);
    onSearch(value);
  };

  return (
    <div className="max-w-md mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="商品名で検索..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" className="shrink-0">
          <Search className="h-4 w-4 mr-2" />
          検索
        </Button>
      </form>
    </div>
  );
};