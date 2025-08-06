import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getReviews, createReview, updateReview, toggleLike } from "@/services/api/reviewService";
import ApperIcon from "@/components/ApperIcon";
import ReviewCard from "@/components/molecules/ReviewCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";

const ReviewsPage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const currentUserId = user?.userId;
  const isAdmin = user?.accounts?.[0]?.is_admin || false;
  // currentUserId will be passed from parent component for authenticated users
  const loadReviews = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getReviews();
      setReviews(data);
      applyFilter(data, filter);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

const applyFilter = (reviewData, filterType) => {
    // Sort reviews: featured first (max 4), then remaining by newest
    const sortedReviews = [...reviewData].sort((a, b) => {
      // If both are featured or both are not featured, sort by created_at DESC
      if (a.featured === b.featured) {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      // Featured reviews come first
      return b.featured - a.featured;
    });

    // Limit featured reviews to maximum 4
    const featuredReviews = sortedReviews.filter(r => r.featured).slice(0, 4);
    const regularReviews = sortedReviews.filter(r => !r.featured);
    const orderedReviews = [...featuredReviews, ...regularReviews];

    switch (filterType) {
      case "featured":
        setFilteredReviews(featuredReviews);
        break;
      case "recent":
        setFilteredReviews(orderedReviews.slice(0, 10));
        break;
      default:
        setFilteredReviews(orderedReviews);
    }
  };

  const handleWriteReview = async () => {
    if (!reviewText.trim()) {
      toast.error("Please enter your review");
      return;
    }
    
    if (reviewText.length > 500) {
      toast.error("Review must be 500 characters or less");
      return;
    }

    setSubmitting(true);
    try {
      const newReview = await createReview({
        text: reviewText.trim(),
        author_id: currentUserId
      });
      
      toast.success("Review submitted successfully!");
      setReviewText("");
      setShowWriteModal(false);
      loadReviews(); // Refresh reviews
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleFeatured = async (reviewId, currentFeatured) => {
    try {
      await updateReview(reviewId, { featured: !currentFeatured });
      toast.success(currentFeatured ? "Review unfeatured" : "Review featured");
      loadReviews(); // Refresh reviews
    } catch (error) {
      toast.error("Failed to update featured status");
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    applyFilter(reviews, newFilter);
  };

const handleLike = async (reviewId, userId) => {
    // Check if user is authenticated before allowing likes
    if (!userId) {
      toast.info("Please log in to like reviews");
      return;
    }
    
    try {
      const updatedReview = await toggleLike(reviewId, userId);
      setReviews(prev => prev.map(r => 
        r.Id === reviewId ? updatedReview : r
      ));
      applyFilter(reviews.map(r => 
        r.Id === reviewId ? updatedReview : r
      ), filter);
      toast.success("Review liked!");
    } catch (error) {
      toast.error("Failed to like review");
}
  };

  useEffect(() => {
    loadReviews();
  }, []);
  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-midnight">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Loading type="hero" className="mb-12" />
          <Loading type="cards" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-midnight">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Error message={error} onRetry={loadReviews} />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-midnight">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-electric/10 border border-electric/30 rounded-full text-electric text-sm font-medium mb-6">
            <ApperIcon name="Star" size={16} className="mr-2" />
            Student Success Stories
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Real Results From
            <span className="block bg-gradient-to-r from-electric to-blue-400 bg-clip-text text-transparent">
              Real Students
            </span>
          </h1>
          
<p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Read authentic testimonials from our community of successful entrepreneurs 
            who've transformed their businesses with Nexus Academy.
          </p>
          
          {isAuthenticated && (
            <div className="flex justify-center mb-8">
              <Button
                onClick={() => setShowWriteModal(true)}
                className="px-6 py-3 bg-electric hover:bg-electric-hover text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <ApperIcon name="Edit" size={16} className="mr-2" />
                리뷰 작성 (Write Review)
              </Button>
            </div>
          )}
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-electric mb-2">4.9/5</div>
            <div className="text-sm text-gray-400">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-electric mb-2">1,200+</div>
            <div className="text-sm text-gray-400">Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-electric mb-2">95%</div>
            <div className="text-sm text-gray-400">Recommend Us</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-electric mb-2">5,000+</div>
            <div className="text-sm text-gray-400">Success Stories</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {[
            { id: "all", label: "All Reviews" },
            { id: "featured", label: "Featured" },
            { id: "recent", label: "Most Recent" }
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => handleFilterChange(filterOption.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === filterOption.id
                  ? 'bg-electric text-white'
                  : 'bg-navy-card text-gray-400 hover:text-white hover:bg-navy-light'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>

        {/* Reviews */}
        {filteredReviews.length === 0 ? (
          <Empty
            title="No Reviews Found"
            description="No reviews match the selected filter. Try selecting a different filter."
            icon="Star"
          />
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredReviews.map((review) => (
<ReviewCard 
                  key={review.Id} 
                  review={review}
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                  onLike={handleLike}
                  onToggleFeatured={handleToggleFeatured}
                />
              ))}
            </div>

            {/* CTA Section */}
            <div className="bg-navy-card rounded-2xl p-8 md:p-12 border border-electric/20 text-center">
              <h3 className="text-3xl font-display font-bold text-white mb-4">
                Ready to Write Your Success Story?
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of entrepreneurs who've transformed their businesses 
                and achieved their goals with Nexus Academy.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  <ApperIcon name="Rocket" size={20} className="mr-2" />
                  Start Your Journey
                </Button>
                <Button variant="ghost" size="lg" className="border border-electric/30">
                  <ApperIcon name="MessageCircle" size={20} className="mr-2" />
                  Schedule a Call
                </Button>
              </div>
            </div>
          </>
)}
      </div>

      {/* Write Review Modal */}
      {showWriteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Write Your Review</h3>
              <button
                onClick={() => setShowWriteModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with Nexus Academy..."
                  className="w-full h-32 px-4 py-3 bg-navy-light border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-electric focus:border-electric resize-none"
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-400">
                    Share your honest experience to help others
                  </span>
                  <span className={`text-sm ${reviewText.length > 450 ? 'text-yellow-400' : 'text-gray-400'}`}>
                    {reviewText.length}/500
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowWriteModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleWriteReview}
                  disabled={submitting || !reviewText.trim() || reviewText.length > 500}
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;