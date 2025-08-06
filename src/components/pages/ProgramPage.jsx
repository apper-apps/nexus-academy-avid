import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getPrograms } from "@/services/api/programService";
import { data } from "@/services/api/postService";
import { createLecture } from "@/services/api/lectureService";
import ApperIcon from "@/components/ApperIcon";
import ProgramCard from "@/components/molecules/ProgramCard";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";

export default function ProgramPage({ filterType = 'all' }) {
  const navigate = useNavigate();
const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    embed_url: "",
    sort_order: ""
  });
  
  const { user: currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser?.is_admin || false;
  const isMembershipPage = filterType === "member";

  const handleAddLecture = () => {
    setFormData({
      category: "",
      title: "",
      embed_url: "",
      sort_order: ""
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate embed_url starts with https://
    if (!formData.embed_url.startsWith('https://')) {
      toast.error('Embed URL must start with https://');
      return;
    }
    
    const submitData = {
      Name: formData.title,
      title: formData.title,
      category: formData.category,
      embed_url: formData.embed_url,
      sort_order: formData.sort_order ? parseInt(formData.sort_order) : null,
      level: "membership",
      program_slug: "membership",
      created_at: new Date().toISOString()
    };
    
    try {
      await createLecture(submitData);
      setIsModalOpen(false);
      toast.success("Lecture created successfully!");
      // Trigger refresh of the programs list
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error(error.message || "Failed to create lecture");
    }
  };
  async function loadPrograms() {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getPrograms();
      if (response && response.length > 0) {
        // Filter programs based on filterType
        let filteredPrograms = response;
        if (filterType === 'member') {
          filteredPrograms = response.filter(program => program.type === 'member');
        } else if (filterType === 'master') {
          filteredPrograms = response.filter(program => program.type === 'master');
        }
        setPrograms(filteredPrograms);
      } else {
        setPrograms([]);
      }
    } catch (err) {
      console.error("Error loading programs:", err);
      setError(err.message || "Failed to load programs");
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  }

  // Load programs on component mount and when refreshTrigger changes

useEffect(() => {
    loadPrograms();
  }, [refreshTrigger, filterType]);

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
          
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 sm:mb-0">
              {headerContent.title}
              <span className="block bg-gradient-to-r from-electric to-blue-400 bg-clip-text text-transparent">
                {headerContent.subtitle}
              </span>
            </h1>
            {isAdmin && isMembershipPage && (
              <Button
                onClick={handleAddLecture}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shrink-0"
              >
                <ApperIcon name="Plus" size={16} />
                Add Lecture
              </Button>
            )}
          </div>
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
            <>
              <div className="bg-navy-card rounded-2xl p-8 border-2 border-dashed border-electric/30 hover:border-electric/60 transition-colors cursor-pointer group"
                   onClick={() => navigate('/admin/programs/new')}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-electric/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-electric/30 transition-colors">
                    <ApperIcon name="Plus" size={24} className="text-electric" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Add Program</h3>
                  <p className="text-gray-400">Create a new program for your students</p>
                </div>
              </div>
              <div className="bg-navy-card rounded-2xl p-8 border-2 border-dashed border-blue-400/30 hover:border-blue-400/60 transition-colors cursor-pointer group"
                   onClick={() => navigate('/admin/lectures')}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-400/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-400/30 transition-colors">
                    <ApperIcon name="Play" size={24} className="text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Add Lecture</h3>
                  <p className="text-gray-400">Create video lectures for your programs</p>
                </div>
              </div>
            </>
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

      {/* Add Lecture Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-navy-card rounded-xl p-6 w-full max-w-2xl border border-electric/20 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Add New Lecture</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="Category *"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g., Mindset, Business"
                required
              />

              <FormField
                label="Title *"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Lecture title"
                required
              />

              <FormField
                label="Embed URL *"
                name="embed_url"
                value={formData.embed_url}
                onChange={handleInputChange}
                placeholder="https://example.com/embed"
                required
              />

              <FormField
                label="Sort Order"
                name="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={handleInputChange}
                placeholder="1"
              />

              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="text-sm text-gray-300 mb-2">Automatic Settings:</div>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>• Program Slug: membership</div>
                  <div>• Level: membership</div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Save Lecture
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}