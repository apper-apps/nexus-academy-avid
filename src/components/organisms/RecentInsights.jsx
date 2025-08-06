import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import PostCard from '@/components/molecules/PostCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { getPosts } from '@/services/api/postService';

const RecentInsights = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPosts();
      // Show only the first 2 posts for homepage
      setPosts(data.slice(0, 2));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Latest Insights
            </h2>
          </div>
          <Loading type="cards" className="grid md:grid-cols-2 gap-8" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <Error message={error} onRetry={loadPosts} />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Latest Insights
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Strategic insights and actionable advice to accelerate your entrepreneurial journey
          </p>
          
          <Button 
            variant="ghost"
            onClick={() => navigate('/insight')}
            className="border border-electric/30 hover:border-electric/60"
          >
            Read All Insights
            <ApperIcon name="BookOpen" size={16} className="ml-2" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <PostCard key={post.Id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentInsights;