import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPrograms } from "@/services/api/programService";
import { data } from "@/services/api/postService";
import ApperIcon from "@/components/ApperIcon";
import ProgramCard from "@/components/molecules/ProgramCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";

export default function ProgramPage({ filterType = 'all', currentUser = null }) {
  const navigate = useNavigate()
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const isAdmin = currentUser?.is_admin || false
async function loadPrograms() {
    try {
      setLoading(true)
      setError("");
      const data = await getPrograms();
      
      // Filter programs based on filterType
      let filteredPrograms = data;
      if (filterType === 'member') {
        filteredPrograms = data.filter(program => program.type === 'member');
      } else if (filterType === 'master') {
        filteredPrograms = data.filter(program => program.type === 'master');
      }
      // filterType === 'all' shows all programs (default)
      
      setPrograms(filteredPrograms);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
    loadPrograms();
  }, [refreshTrigger]);

  // Expose refresh function globally for state invalidation
  useEffect(() => {
    window.invalidateProgramsQuery = () => {
      setRefreshTrigger(prev => prev + 1);
    };
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

// Get header content based on filter type
  const getHeaderContent = () => {
    if (filterType === 'member') {
      return {
        badge: "멤버십 프로그램",
        title: "기초를 다지는",
        subtitle: "멤버십 프로그램",
        description: "창업의 기초부터 탄탄히 다지고, 검증된 전략과 커뮤니티 지원을 통해 첫 번째 사업을 성공적으로 확장하세요."
      };
    } else if (filterType === 'master') {
      return {
        badge: "마스터 프로그램", 
        title: "전문성을 완성하는",
        subtitle: "마스터 프로그램",
        description: "업계 전문가들로부터 고급 전략과 심화 기술을 배우고, 귀하의 전문 분야에서 최고 수준에 도달하세요."
      };
    }
    
    // Default for 'all'
    return {
      badge: "Premium Learning Programs",
      title: "Choose Your Path to",
      subtitle: "Entrepreneurial Success",
      description: "Our carefully crafted programs combine proven strategies, expert mentorship, and a supportive community to accelerate your business growth."
    };
  };

  const headerContent = getHeaderContent();

  return (
    <div className="pt-16 min-h-screen bg-midnight">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-electric/10 border border-electric/30 rounded-full text-electric text-sm font-medium mb-6">
            <ApperIcon name="BookOpen" size={16} className="mr-2" />
            {headerContent.badge}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            {headerContent.title}
            <span className="block bg-gradient-to-r from-electric to-blue-400 bg-clip-text text-transparent">
              {headerContent.subtitle}
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            {headerContent.description}
          </p>
        </div>

{/* Programs Grid */}
<div className="grid md:grid-cols-2 gap-8 mb-16">
          {programs.map((program) => (
            <ProgramCard key={program.Id} program={program} currentUser={currentUser} />
          ))}
          {isAdmin && (
            <div className="bg-navy-card rounded-2xl p-8 border-2 border-dashed border-electric/30 hover:border-electric/60 transition-colors cursor-pointer group"
                 onClick={() => navigate('/admin/programs/new')}>
              <div className="text-center">
                <div className="w-16 h-16 bg-electric/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-electric/30 transition-colors">
                  <ApperIcon name="Plus" size={24} className="text-electric" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Add Program</h3>
                <p className="text-gray-400">Create a new master program for your students</p>
              </div>
            </div>
          )}
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