import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ProgramCard from '@/components/molecules/ProgramCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { getPrograms } from '@/services/api/programService';

const ProgramPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadPrograms = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPrograms();
      setPrograms(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-midnight">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Loading type="hero" className="mb-12" />
          <Loading type="cards" className="grid md:grid-cols-2 gap-8" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-midnight">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Error message={error} onRetry={loadPrograms} />
        </div>
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="pt-16 min-h-screen bg-midnight">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Empty 
            title="No Programs Available"
            description="We're working on bringing you amazing learning programs. Check back soon!"
            icon="BookOpen"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-midnight">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-electric/10 border border-electric/30 rounded-full text-electric text-sm font-medium mb-6">
            <ApperIcon name="BookOpen" size={16} className="mr-2" />
            Premium Learning Programs
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Choose Your Path to
            <span className="block bg-gradient-to-r from-electric to-blue-400 bg-clip-text text-transparent">
              Entrepreneurial Success
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Our carefully crafted programs combine proven strategies, expert mentorship, 
            and a supportive community to accelerate your business growth.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {programs.map((program) => (
            <ProgramCard key={program.Id} program={program} />
          ))}
        </div>

        {/* Why Choose Section */}
        <div className="bg-navy-card rounded-2xl p-8 md:p-12 border border-electric/20">
          <h2 className="text-3xl font-display font-bold text-white mb-8 text-center">
            Why Choose Nexus Academy?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-electric/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Target" size={24} className="text-electric" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Proven Results</h3>
              <p className="text-gray-400">Our students achieve measurable success with our tested strategies and frameworks.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-electric/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Users" size={24} className="text-electric" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Expert Community</h3>
              <p className="text-gray-400">Learn from industry leaders and connect with like-minded entrepreneurs.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-electric/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Zap" size={24} className="text-electric" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Accelerated Growth</h3>
              <p className="text-gray-400">Fast-track your success with our intensive, results-focused curriculum.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              onClick={() => navigate('/reviews')}
            >
              Read Success Stories
              <ApperIcon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramPage;