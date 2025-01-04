import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReviewFormProps {
  initialRating?: number;
  initialComment?: string;
  onSubmit: (rating: number, comment: string) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export const ReviewForm = ({
  initialRating = 5,
  initialComment = "",
  onSubmit,
  onCancel,
  submitLabel = "投稿する",
}: ReviewFormProps) => {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);

  return (
    <div>
      <div className="flex items-center mb-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`w-6 h-6 cursor-pointer ${
              index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
            onClick={() => setRating(index + 1)}
          />
        ))}
      </div>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="レビューを入力してください"
        className="mb-2"
      />
      <div className="flex gap-2">
        <Button
          onClick={() => onSubmit(rating, comment)}
          disabled={!comment.trim()}
        >
          {submitLabel}
        </Button>
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            キャンセル
          </Button>
        )}
      </div>
    </div>
  );
};