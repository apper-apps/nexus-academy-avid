import { useState } from 'react';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';

const ReviewCard = ({ review, currentUserId = null, onLike }) => {
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
        
        {review.featured && (
          <Badge variant="primary" size="sm">
            <ApperIcon name="Star" size={12} className="mr-1" />
            Featured
          </Badge>
        )}
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
          } ${!currentUserId ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <ApperIcon 
            name="Heart" 
            size={16} 
            className={isLiked ? 'fill-current' : ''} 
          />
          <span className="text-sm">
            {review.likes.length} {review.likes.length === 1 ? 'like' : 'likes'}
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