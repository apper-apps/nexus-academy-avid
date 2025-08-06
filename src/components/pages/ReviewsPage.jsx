import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getReviews, toggleLike } from "@/services/api/reviewService";
import { data } from "@/services/api/postService";
import ApperIcon from "@/components/ApperIcon";
import ReviewCard from "@/components/molecules/ReviewCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";

const ReviewsPage = ({ currentUserId = null }) => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  // No authentication required for viewing reviews
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
    switch (filterType) {
      case "featured":
        setFilteredReviews(reviewData.filter(r => r.featured));
        break;
      case "recent":
        setFilteredReviews(reviewData.slice(0, 10));
        break;
      default:
        setFilteredReviews(reviewData);
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
                  onLike={handleLike}
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
    </div>
  );
};

export default ReviewsPage;