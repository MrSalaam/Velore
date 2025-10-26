import React, { useState } from 'react';
import { Star, ThumbsUp, CheckCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatters';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: Date;
  helpful: number;
  verified: boolean;
}

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  onSubmitReview?: (review: Omit<Review, 'id' | 'userId' | 'userName' | 'createdAt' | 'helpful'>) => void;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  reviews,
  averageRating,
  totalReviews,
  onSubmitReview,
}) => {
  const { isAuthenticated, user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { stars, count, percentage };
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !onSubmitReview) return;

    setIsSubmitting(true);
    try {
      await onSubmitReview({
        rating,
        title,
        comment,
        verified: true,
      });

      // Reset form
      setRating(0);
      setTitle('');
      setComment('');
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Customer Reviews
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={24}
                  className={
                    i < Math.floor(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }
                />
              ))}
            </div>
            <p className="text-gray-600">
              Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{stars}</span>
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-yellow-400 h-full rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Write Review Button */}
        {isAuthenticated && !showReviewForm && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button
              variant="primary"
              fullWidth
              onClick={() => setShowReviewForm(true)}
            >
              Write a Review
            </Button>
          </div>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Write Your Review
          </h4>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Star Rating Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating *
              </label>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    onMouseEnter={() => setHoveredRating(i + 1)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={
                        i < (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm text-gray-600">
                    {rating} star{rating !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Review Title */}
            <Input
              label="Review Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sum up your experience"
              required
            />

            {/* Review Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Your Review *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this product..."
                required
                rows={5}
                className="
                  block w-full rounded-lg border border-gray-300
                  px-4 py-2.5 transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                "
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowReviewForm(false);
                  setRating(0);
                  setTitle('');
                  setComment('');
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                disabled={rating === 0}
              >
                Submit Review
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">
          All Reviews ({totalReviews})
        </h4>

        {reviews.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">
              No reviews yet. Be the first to review this product!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">
                        {review.userName}
                      </span>
                      {review.verified && (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle size={14} />
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <h5 className="font-semibold text-gray-900 mb-2">
                  {review.title}
                </h5>
                <p className="text-gray-700 mb-4">{review.comment}</p>

                {/* Review Actions */}
                <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    <ThumbsUp size={16} />
                    Helpful ({review.helpful})
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};