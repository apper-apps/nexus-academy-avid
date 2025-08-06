import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { getPostBySlug } from '@/services/api/postService';

const InsightDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) {
        setError("Post not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await getPostBySlug(slug);
        setPost(data);
        
        // SEO: Update document title and meta description
        if (data) {
          document.title = `${data.title} | Insight`;
          
          // Update meta description
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute('content', data.summary || data.title);
          } else {
            // Create meta description if it doesn't exist
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = data.summary || data.title;
            document.head.appendChild(meta);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-midnight">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Loading type="hero" className="mb-12" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pt-16 min-h-screen bg-midnight">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Error 
            message={error || "Post not found"} 
            onRetry={() => navigate('/insight')}
            retryText="Back to Insights"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-midnight">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Back to Insights Link */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/insight')}
            className="inline-flex items-center text-electric hover:text-electric-hover transition-colors font-medium"
          >
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            목록으로 돌아가기 (Back to Insights)
          </button>
        </div>

        {/* Post Header */}
        <div className="mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-electric/10 border border-electric/30 rounded-full text-electric text-sm font-medium mb-6">
            <ApperIcon name="BookOpen" size={16} className="mr-2" />
            Strategic Insight
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            {post.title}
          </h1>
          
          {post.summary && (
            <p className="text-xl text-gray-300 max-w-4xl mb-8">
              {post.summary}
            </p>
          )}

          {/* Post Meta */}
          <div className="flex items-center text-gray-400 text-sm">
            {post.author_id?.Name && (
              <div className="flex items-center mr-6">
                <ApperIcon name="User" size={16} className="mr-2" />
                <span>{post.author_id.Name}</span>
              </div>
            )}
            
            {post.created_at && (
              <div className="flex items-center">
                <ApperIcon name="Calendar" size={16} className="mr-2" />
                <time dateTime={post.created_at}>
                  {format(new Date(post.created_at), 'MMMM d, yyyy')}
                </time>
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Image */}
        {post.thumbnail_url && (
          <div className="mb-12">
            <img
              src={post.thumbnail_url}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-2xl"
            />
          </div>
        )}

        {/* Rich Text Content - Full Width */}
        <div className="w-full">
          <article className="prose prose-lg prose-invert max-w-none">
            <div 
              className="text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        </div>

        {/* Back to Insights CTA */}
        <div className="mt-16 pt-12 border-t border-gray-700">
          <div className="text-center">
            <h3 className="text-2xl font-display font-bold text-white mb-4">
              Explore More Insights
            </h3>
            <p className="text-gray-300 mb-6">
              Discover more strategic insights and actionable advice for your entrepreneurial journey.
            </p>
            <button
              onClick={() => navigate('/insight')}
              className="inline-flex items-center px-6 py-3 bg-electric hover:bg-electric-hover text-white font-medium rounded-lg transition-colors"
            >
              <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
              View All Insights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightDetailPage;