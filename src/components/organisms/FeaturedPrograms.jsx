import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ProgramCard from '@/components/molecules/ProgramCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { getPrograms } from '@/services/api/programService';

const FeaturedPrograms = () => {
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
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Featured Programs
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose your path to success with our premium learning programs
            </p>
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
          <Error message={error} onRetry={loadPrograms} />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-midnight to-navy-light/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Featured Programs
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Choose your path to success with our premium learning programs designed 
            for ambitious entrepreneurs
          </p>
          
          <Button 
            variant="ghost"
            onClick={() => navigate('/program')}
            className="border border-electric/30 hover:border-electric/60"
          >
            View All Programs
            <ApperIcon name="ArrowRight" size={16} className="ml-2" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {programs.map((program) => (
            <ProgramCard key={program.Id} program={program} />
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="bg-navy-card rounded-2xl p-8 border border-electric/20">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Ready to Start Your Transformation?
            </h3>
            <p className="text-gray-300 mb-6">
              Join thousands of successful entrepreneurs who've chosen Nexus Academy
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/program')}
            >
              Choose Your Program
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPrograms;