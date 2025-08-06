import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ApperIcon from '@/components/ApperIcon';
import PostCard from '@/components/molecules/PostCard';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { getPosts } from '@/services/api/postService';

const InsightPage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
const navigate = useNavigate();
  
  // Get user state for admin checking
  const { user } = useSelector((state) => state.user);
  const isAdmin = user?.is_admin || false;

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPosts();
      setPosts(data);
      setFilteredPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-midnight">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Loading type="hero" className="mb-12" />
          <Loading type="cards" className="grid md:grid-cols-2 gap-8" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-midnight">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Error message={error} onRetry={loadPosts} />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-midnight">
<div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header with New Post Button */}
        
        {/* Header */}
{/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-electric/10 border border-electric/30 rounded-full text-electric text-sm font-medium mb-6">
            <ApperIcon name="BookOpen" size={16} className="mr-2" />
            Strategic Insights
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Insights &
            <span className="block bg-gradient-to-r from-electric to-blue-400 bg-clip-text text-transparent">
              Strategic Thinking
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Practical insights, strategic frameworks, and actionable advice to accelerate 
            your entrepreneurial journey and business growth.
          </p>
          
          {/* New Post Button - Admin Only */}
          {isAdmin && (
            <div className="mb-8">
              <button 
                onClick={() => navigate('/insight/new')}
                className="flex items-center px-4 py-2 bg-electric hover:bg-electric-hover text-white font-medium rounded-lg transition-colors mx-auto"
              >
                <ApperIcon name="Plus" size={16} className="mr-2" />
                새 글 (New Post)
              </button>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <SearchBar
            placeholder="Search insights..."
            onSearch={handleSearch}
          />
        </div>

        {/* Posts */}
        {filteredPosts.length === 0 ? (
          searchQuery ? (
            <Empty
              title="No Insights Found"
              description={`No insights match "${searchQuery}". Try adjusting your search terms.`}
              icon="Search"
            />
          ) : (
            <Empty
              title="No Insights Yet"
              description="We're working on bringing you valuable insights. Check back soon!"
              icon="BookOpen"
            />
          )
        ) : (
          <>
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredPosts.map((post) => (
                <PostCard key={post.Id} post={post} />
              ))}
            </div>

            {/* Newsletter CTA */}
            <div className="bg-navy-card rounded-2xl p-8 border border-electric/20 text-center">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-display font-bold text-white mb-4">
                  Never Miss an Insight
                </h3>
                <p className="text-gray-300 mb-6">
                  Get the latest strategic insights delivered directly to your inbox. 
                  Join thousands of entrepreneurs who rely on our weekly insights.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-navy-light border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-electric focus:border-electric"
                  />
                  <button className="px-6 py-3 bg-electric hover:bg-electric-hover text-white font-medium rounded-lg transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InsightPage;