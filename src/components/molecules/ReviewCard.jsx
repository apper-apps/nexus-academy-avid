import { useState } from 'react';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';

const ReviewCard = ({ review, currentUserId = null, isAdmin = false, onLike, onToggleFeatured }) => {
  const [isLiking, setIsLiking] = useState(false);
  const isLiked = currentUserId && review.likes.includes(currentUserId);

  const handleLike = async () => {
    if (!currentUserId || isLiking) return;
    
    setIsLiking(true);
    try {
      await onLike?.(review.Id, currentUserId);
    } catch (error) {
      console.error('Error liking review:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-electric/20 rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={20} className="text-electric" />
          </div>
          <div>
            <div className="font-medium text-white">Community Member</div>
            <div className="text-sm text-gray-400">
              {format(new Date(review.created_at), 'MMM dd, yyyy')}
            </div>
          </div>
</div>
        
        <div className="flex items-center space-x-2">
          {review.featured && (
            <Badge variant="primary" size="sm">
              <ApperIcon name="Star" size={12} className="mr-1" />
              Featured
            </Badge>
          )}
          
          {isAdmin && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`featured-${review.Id}`}
                checked={review.featured || false}
                onChange={() => onToggleFeatured?.(review.Id, review.featured)}
                className="w-4 h-4 text-electric bg-navy-card border-gray-600 rounded focus:ring-electric focus:ring-2"
              />
              <label
                htmlFor={`featured-${review.Id}`}
                className="text-xs text-gray-400 cursor-pointer hover:text-white transition-colors"
              >
                추천 고정
              </label>
            </div>
          )}
        </div>
      </div>
      
      <p className="text-gray-300 mb-4 leading-relaxed">
        {review.text}
      </p>
      
<div className="flex items-center justify-between">
        <button
          onClick={handleLike}
          disabled={!currentUserId || isLiking}
          className={`flex items-center space-x-2 transition-colors duration-200 ${
            isLiked 
              ? 'text-red-400 hover:text-red-300' 
              : 'text-gray-400 hover:text-red-400'
          } ${!currentUserId ? 'cursor-default opacity-60' : 'cursor-pointer'}`}
          title={!currentUserId ? "Login to like reviews" : isLiked ? "Unlike" : "Like"}
        >
          <ApperIcon 
            name="Heart" 
            size={16} 
            className={isLiked ? 'fill-current' : ''} 
          />
          <span className="text-sm">
            {Array.isArray(review.likes) ? review.likes.length : 
             (review.likes ? review.likes.split(',').filter(Boolean).length : 0)} likes
          </span>
        </button>
        
        <div className="flex items-center text-sm text-gray-500">
          <ApperIcon name="MessageCircle" size={14} className="mr-1" />
          Helpful review
        </div>
      </div>
    </Card>
  );
};

export default ReviewCard;