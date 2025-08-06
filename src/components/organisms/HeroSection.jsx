import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-electric/5 via-midnight to-navy-light"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-electric/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-electric/5 rounded-full blur-2xl"></div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <div className="inline-flex items-center px-4 py-2 bg-electric/10 border border-electric/30 rounded-full text-electric text-sm font-medium mb-8">
            <ApperIcon name="Zap" size={16} className="mr-2" />
            Premium Learning Experience
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
          Transform Your
          <span className="block bg-gradient-to-r from-electric to-blue-400 bg-clip-text text-transparent">
            Potential Into Profit
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Join thousands of entrepreneurs who've scaled their businesses through our 
          proven strategies, expert guidance, and supportive community.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            size="xl" 
            onClick={() => navigate('/program')}
            className="text-lg px-8 py-4"
          >
            <ApperIcon name="Rocket" size={20} className="mr-2" />
            Start Your Journey
          </Button>
          
          <Button 
            variant="ghost" 
            size="xl"
            onClick={() => navigate('/reviews')}
            className="text-lg px-8 py-4 border border-gray-600 hover:border-electric/50"
          >
            <ApperIcon name="Play" size={20} className="mr-2" />
            Success Stories
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-electric mb-2">5,000+</div>
            <div className="text-gray-400">Students Enrolled</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-electric mb-2">95%</div>
            <div className="text-gray-400">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-electric mb-2">24/7</div>
            <div className="text-gray-400">Community Support</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;