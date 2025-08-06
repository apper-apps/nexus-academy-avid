import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const PostCard = ({ post, author = "Nexus Academy" }) => {
  const navigate = useNavigate();

  return (
    <Card hover className="cursor-pointer" onClick={() => navigate(`/insight/${post.slug}`)}>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-gray-300 mb-4 line-clamp-3">
          {post.content.substring(0, 180)}...
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-electric rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">{author}</div>
              <div className="text-xs text-gray-400">
                {format(new Date(post.created_at), 'MMM dd, yyyy')}
              </div>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-400">
            <span>Read more</span>
            <ApperIcon name="ArrowRight" size={16} className="ml-1" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;