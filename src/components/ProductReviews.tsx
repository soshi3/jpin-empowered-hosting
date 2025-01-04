import { useState } from "react";
import { useAuth } from "@supabase/auth-helpers-react";
import { Star, Edit2, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: number;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: {
    email: string;
  };
}

interface ProductReviewsProps {
  productId: string;
}

export const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { toast } = useToast();
  const auth = useAuth();
  const queryClient = useQueryClient();
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
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
    mutationFn: async (review: typeof newReview) => {
      const { error } = await supabase.from("reviews").insert({
        product_id: productId,
        rating: review.rating,
        comment: review.comment,
        user_id: auth?.user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      setNewReview({ rating: 5, comment: "" });
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
    mutationFn: async (review: Review) => {
      const { error } = await supabase
        .from("reviews")
        .update({
          rating: review.rating,
          comment: review.comment,
        })
        .eq("id", review.id);
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

  if (isLoading) {
    return <div>レビューを読み込み中...</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">カスタマーレビュー</h2>
      
      {auth?.user ? (
        !editingReview && (
          <div className="mb-8 p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">レビューを書く</h3>
            <div className="flex items-center mb-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`w-6 h-6 cursor-pointer ${
                    index < newReview.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => setNewReview({ ...newReview, rating: index + 1 })}
                />
              ))}
            </div>
            <Textarea
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              placeholder="レビューを入力してください"
              className="mb-2"
            />
            <Button
              onClick={() => createReviewMutation.mutate(newReview)}
              disabled={!newReview.comment.trim()}
            >
              投稿する
            </Button>
          </div>
        )
      ) : (
        <p className="mb-4 text-gray-600">
          レビューを投稿するにはログインしてください。
        </p>
      )}

      <div className="space-y-4">
        {reviews?.map((review) => (
          <div key={review.id} className="p-4 border rounded-lg">
            {editingReview?.id === review.id ? (
              <div>
                <div className="flex items-center mb-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`w-6 h-6 cursor-pointer ${
                        index < editingReview.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                      onClick={() =>
                        setEditingReview({
                          ...editingReview,
                          rating: index + 1,
                        })
                      }
                    />
                  ))}
                </div>
                <Textarea
                  value={editingReview.comment}
                  onChange={(e) =>
                    setEditingReview({
                      ...editingReview,
                      comment: e.target.value,
                    })
                  }
                  className="mb-2"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => updateReviewMutation.mutate(editingReview)}
                  >
                    更新
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingReview(null)}
                  >
                    キャンセル
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-gray-600">
                      {review.profiles?.email}
                    </span>
                  </div>
                  {auth?.user?.id === review.user_id && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingReview(review)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteReviewMutation.mutate(review.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};