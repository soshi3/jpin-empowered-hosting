import { Star, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Review } from "./types";

interface ReviewItemProps {
  review: Review;
  currentUserId?: string;
  onEdit: (review: Review) => void;
  onDelete: (reviewId: number) => void;
}

export const ReviewItem = ({
  review,
  currentUserId,
  onEdit,
  onDelete,
}: ReviewItemProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="flex">{renderStars(review.rating)}</div>
          <span className="text-gray-600">{review.profiles?.email}</span>
        </div>
        {currentUserId === review.user_id && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(review)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(review.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      <p className="text-gray-700">{review.comment}</p>
    </div>
  );
};