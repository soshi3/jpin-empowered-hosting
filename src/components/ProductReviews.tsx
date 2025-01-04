import { useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ReviewForm } from "./reviews/ReviewForm";
import { ReviewItem } from "./reviews/ReviewItem";
import { Review } from "./reviews/types";

interface ProductReviewsProps {
  productId: string;
}

export const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { toast } = useToast();
  const user = useUser();
  const queryClient = useQueryClient();
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      console.log("Fetching reviews for product:", productId);
      const { data, error } = await supabase
        .from("reviews")
        .select(`*, profiles(email)`)
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
        throw error;
      }
      console.log("Fetched reviews:", data);
      return data as Review[];
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async ({
      rating,
      comment,
    }: {
      rating: number;
      comment: string;
    }) => {
      const { error } = await supabase.from("reviews").insert({
        product_id: productId,
        rating,
        comment,
        user_id: user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      toast({
        title: "レビューを投稿しました",
        description: "ありがとうございます！",
      });
    },
    onError: (error) => {
      console.error("Error creating review:", error);
      toast({
        title: "エラーが発生しました",
        description: "レビューの投稿に失敗しました。",
        variant: "destructive",
      });
    },
  });

  const updateReviewMutation = useMutation({
    mutationFn: async ({
      id,
      rating,
      comment,
    }: {
      id: number;
      rating: number;
      comment: string;
    }) => {
      const { error } = await supabase
        .from("reviews")
        .update({ rating, comment })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      setEditingReview(null);
      toast({
        title: "レビューを更新しました",
      });
    },
    onError: (error) => {
      console.error("Error updating review:", error);
      toast({
        title: "エラーが発生しました",
        description: "レビューの更新に失敗しました。",
        variant: "destructive",
      });
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      toast({
        title: "レビューを削除しました",
      });
    },
    onError: (error) => {
      console.error("Error deleting review:", error);
      toast({
        title: "エラーが発生しました",
        description: "レビューの削除に失敗しました。",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div>レビューを読み込み中...</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">カスタマーレビュー</h2>
      
      {user ? (
        !editingReview && (
          <div className="mb-8 p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">レビューを書く</h3>
            <ReviewForm
              onSubmit={(rating, comment) =>
                createReviewMutation.mutate({ rating, comment })
              }
            />
          </div>
        )
      ) : (
        <p className="mb-4 text-gray-600">
          レビューを投稿するにはログインしてください。
        </p>
      )}

      <div className="space-y-4">
        {editingReview ? (
          <div className="p-4 border rounded-lg">
            <ReviewForm
              initialRating={editingReview.rating}
              initialComment={editingReview.comment}
              onSubmit={(rating, comment) =>
                updateReviewMutation.mutate({
                  id: editingReview.id,
                  rating,
                  comment,
                })
              }
              onCancel={() => setEditingReview(null)}
              submitLabel="更新"
            />
          </div>
        ) : null}

        {reviews?.map((review) => (
          <ReviewItem
            key={review.id}
            review={review}
            currentUserId={user?.id}
            onEdit={setEditingReview}
            onDelete={(reviewId) => deleteReviewMutation.mutate(reviewId)}
          />
        ))}
      </div>
    </div>
  );
};