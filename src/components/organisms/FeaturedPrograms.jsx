import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { getLectures } from '@/services/api/lectureService';

const FeaturedPrograms = () => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openAccordion, setOpenAccordion] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const navigate = useNavigate();

  const loadLectures = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getLectures();
      setLectures(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLectures();
  }, []);

  // Get unique categories
  const categories = ["All", ...new Set(lectures.map(lecture => lecture.category))];

  // Filter lectures by selected category
  const filteredLectures = selectedCategory === "All" 
    ? lectures 
    : lectures.filter(lecture => lecture.category === selectedCategory);

  // Group lectures by category for accordion display
  const groupedLectures = filteredLectures.reduce((acc, lecture) => {
    const category = lecture.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(lecture);
    return acc;
  }, {});

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

const handleAccordionToggle = (categoryName) => {
    // Ensure only one accordion is open at a time
    setOpenAccordion(openAccordion === categoryName ? null : categoryName);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
    setOpenAccordion(null); // Reset accordion when category changes
  };

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Lecture Library
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Explore our comprehensive collection of lectures organized by category
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
          <Error message={error} onRetry={loadLectures} />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-midnight to-navy-light/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Lecture Library
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Explore our comprehensive collection of lectures organized by category
          </p>
        </div>

        {/* Main Content Grid - Desktop: 280px | 1fr */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Desktop Category Sidebar */}
          <div className="hidden lg:block">
            <div className="bg-navy-card rounded-xl p-6 border border-electric/20 sticky top-8">
              <h3 className="font-semibold text-white mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-electric/20 text-electric border border-electric/30'
                        : 'text-gray-300 hover:text-white hover:bg-navy-light/50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Category Dropdown */}
          <div className="lg:hidden mb-6 relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="w-full bg-navy-card border border-electric/20 rounded-xl p-4 flex items-center justify-between text-white"
            >
              <span className="font-medium">Category: {selectedCategory}</span>
              <ApperIcon 
                name={showCategoryDropdown ? "ChevronUp" : "ChevronDown"} 
                size={20}
                className="text-gray-400"
              />
            </button>
            
            {showCategoryDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-navy-card border border-electric/20 rounded-xl p-2 z-10">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-electric/20 text-electric'
                        : 'text-gray-300 hover:text-white hover:bg-navy-light/50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Accordion Content */}
          <div className="lg:col-start-2">
            {Object.entries(groupedLectures).length === 0 ? (
              <div className="text-center py-12">
                <ApperIcon name="BookOpen" size={48} className="text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No lectures found</h3>
                <p className="text-gray-500">Try selecting a different category.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedLectures).map(([categoryName, categoryLectures]) => (
                  <div key={categoryName} className="bg-navy-card rounded-xl border border-electric/20">
                    {/* Accordion Header */}
                    <button
                      onClick={() => handleAccordionToggle(categoryName)}
                      className="w-full p-6 flex items-center justify-between text-left hover:bg-navy-light/30 transition-colors rounded-xl"
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">{categoryName}</h3>
                        <p className="text-gray-400 text-sm">{categoryLectures.length} lecture{categoryLectures.length !== 1 ? 's' : ''}</p>
                      </div>
                      <ApperIcon 
                        name={openAccordion === categoryName ? "ChevronDown" : "ChevronRight"}
                        size={24}
                        className="text-gray-400"
                      />
                    </button>

                    {/* Accordion Content */}
                    {openAccordion === categoryName && (
                      <div className="border-t border-gray-600">
                        {categoryLectures.map((lecture, index) => (
                          <div key={lecture.Id} className={`p-6 ${index !== categoryLectures.length - 1 ? 'border-b border-gray-700' : ''}`}>
                            <div className="flex flex-col lg:flex-row gap-6">
                              {/* Video Embed */}
                              <div className="lg:w-1/2">
                                <div className="aspect-video bg-navy-light rounded-lg overflow-hidden border border-gray-600">
{lecture.embed_url ? (
                                    <iframe
                                      src={lecture.embed_url}
                                      className="w-full h-full"
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                      title={lecture.title}
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center h-full">
                                      <div className="text-center">
                                        <ApperIcon name="Play" size={32} className="text-gray-500 mx-auto mb-2" />
                                        <p className="text-gray-500 text-sm">Video not available</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Lecture Info */}
                              <div className="lg:w-1/2">
                                <div className="flex flex-wrap gap-2 mb-3">
                                  <Badge variant={getLevelBadgeVariant(lecture.level)}>
                                    {lecture.level.replace('_', ' ')}
                                  </Badge>
                                  <div className="flex items-center text-sm text-gray-400">
                                    <ApperIcon name="Clock" size={14} className="mr-1" />
                                    {formatDuration(lecture.duration)}
                                  </div>
                                </div>
                                
                                <h4 className="text-lg font-semibold text-white mb-2">
                                  {lecture.title}
                                </h4>
                                
                                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                                  {lecture.description}
                                </p>

                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => navigate(`/lecture/${lecture.Id}`)}
                                  >
                                    View Details
                                    <ApperIcon name="ArrowRight" size={14} className="ml-2" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-400 hover:text-white"
                                  >
                                    <ApperIcon name="Play" size={14} className="mr-2" />
                                    Play
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="bg-navy-card rounded-2xl p-8 border border-electric/20">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Ready to Start Learning?
            </h3>
            <p className="text-gray-300 mb-6">
              Join thousands of students advancing their skills with our premium content
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/program')}
            >
              Explore All Programs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPrograms;