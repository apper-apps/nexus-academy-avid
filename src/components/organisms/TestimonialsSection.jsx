import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ReviewCard from '@/components/molecules/ReviewCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { getFeaturedReviews } from '@/services/api/reviewService';

const TestimonialsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getFeaturedReviews();
      // Show only the first 3 featured reviews
      setReviews(data.slice(0, 3));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-navy-light/10 to-midnight">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Student Success Stories
            </h2>
          </div>
          <Loading type="cards" className="grid md:grid-cols-3 gap-8" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-navy-light/10 to-midnight">
        <div className="max-w-7xl mx-auto">
          <Error message={error} onRetry={loadReviews} />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-navy-light/10 to-midnight">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Student Success Stories
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Real transformations from our community of ambitious entrepreneurs
          </p>
          
          <Button 
            variant="ghost"
            onClick={() => navigate('/reviews')}
            className="border border-electric/30 hover:border-electric/60"
          >
            Read All Reviews
            <ApperIcon name="Star" size={16} className="ml-2" />
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <ReviewCard 
              key={review.Id} 
              review={review}
              currentUserId={null} // No user interaction on homepage
            />
          ))}
        </div>

        {/* Social proof stats */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div>
              <div className="text-2xl font-bold text-electric mb-1">4.9/5</div>
              <div className="text-sm text-gray-400">Average Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-electric mb-1">1,200+</div>
              <div className="text-sm text-gray-400">Reviews</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-electric mb-1">89%</div>
              <div className="text-sm text-gray-400">Would Recommend</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-electric mb-1">30 Days</div>
              <div className="text-sm text-gray-400">Money Back</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;