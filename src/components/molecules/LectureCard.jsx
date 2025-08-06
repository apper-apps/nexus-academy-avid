import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';

const LectureCard = ({ lecture, isLocked = false, currentUser }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isLocked) {
      return; // Prevent navigation for locked lectures
    }
    navigate(`/lecture/${lecture.Id}`);
  };
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };

  const getLevelBadgeVariant = (level) => {
    switch (level) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'danger';
      case 'master_common':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
<Card 
      hover={!isLocked} 
      className={`${isLocked ? 'cursor-default' : 'cursor-pointer'} relative`} 
      onClick={handleClick}
    >
      <div className={`aspect-video bg-gradient-to-br from-electric/20 to-navy-light rounded-t-xl flex items-center justify-center ${isLocked ? 'blur-sm' : ''}`}>
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
          <ApperIcon name={isLocked ? "Lock" : "Play"} size={24} className="text-electric ml-1" />
        </div>
      </div>
      
      <div className={`p-4 ${isLocked ? 'blur-sm' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <Badge variant={getLevelBadgeVariant(lecture.level)} size="sm">
            {lecture.level.replace('_', ' ')}
          </Badge>
          <div className="flex items-center text-sm text-gray-400">
            <ApperIcon name="Clock" size={14} className="mr-1" />
            {formatDuration(lecture.duration)}
          </div>
        </div>
        
        <h3 className="font-semibold text-white mb-2 line-clamp-2">
          {lecture.title}
        </h3>
        
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
          {lecture.description}
        </p>
        
        <div className="flex items-center justify-between">
          <Badge variant="default" size="sm">
            {lecture.category}
          </Badge>
          <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
        </div>
      </div>
      
      {isLocked && (
        <div className="absolute inset-0 bg-navy-card/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-electric/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Lock" size={24} className="text-electric" />
            </div>
            <p className="text-white font-semibold mb-2">Premium Content</p>
            <p className="text-gray-400 text-sm">
              {!currentUser ? "Log in to unlock this lecture" : "Upgrade to access all content"}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default LectureCard;