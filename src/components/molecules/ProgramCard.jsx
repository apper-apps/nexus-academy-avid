import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const ProgramCard = ({ program }) => {
  const navigate = useNavigate();

  return (
    <Card hover className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">
            {program.title}
          </h3>
          <Badge variant="primary" size="sm" className="mb-3">
            {program.type === 'member' ? 'Member Program' : 'Master Program'}
          </Badge>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-electric">
${program.price.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">one-time</div>
        </div>
      </div>

      <p className="text-gray-300 mb-6 line-clamp-3">
        {program.description}
      </p>

      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm text-gray-400">
          <ApperIcon name="Clock" size={16} className="mr-2" />
          <span>Self-paced learning</span>
        </div>
        <div className="flex items-center text-sm text-gray-400">
          <ApperIcon name="Users" size={16} className="mr-2" />
          <span>Community access</span>
        </div>
        {program.has_common_course && (
          <div className="flex items-center text-sm text-gray-400">
            <ApperIcon name="Star" size={16} className="mr-2" />
            <span>Common course included</span>
          </div>
        )}
      </div>

      <div className="flex space-x-3">
        <Button 
          className="flex-1"
          onClick={() => navigate(`/program/${program.slug}`)}
        >
          Learn More
        </Button>
        <Button 
          variant="secondary"
          onClick={() => navigate(`/program/${program.slug}`)}
          className="px-3"
        >
          <ApperIcon name="ArrowRight" size={16} />
        </Button>
      </div>
    </Card>
  );
};

export default ProgramCard;