import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { getLectureById } from '@/services/api/lectureService';
import { getProgramById } from '@/services/api/programService';

const LectureDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [lecture, setLecture] = useState(null);
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const loadLectureData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const lectureData = await getLectureById(id);
      
      if (!lectureData) {
        throw new Error(`Lecture with ID ${id} not found`);
      }
      
      setLecture(lectureData);
      
      // Only try to load program if lecture has a program_id
      if (lectureData.program_id) {
        try {
          const programData = await getProgramById(lectureData.program_id);
          setProgram(programData);
        } catch (programErr) {
          console.error("Error loading associated program:", programErr.message);
          // Don't fail the entire page if program can't be loaded
          setProgram(null);
        }
      }
    } catch (err) {
      console.error("Error loading lecture data:", err.message);
      setError(err.message || "Failed to load lecture. The lecture record may not exist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLectureData();
  }, [id]);

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

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-midnight">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Loading type="hero" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-midnight">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Error message={error} onRetry={loadLectureData} />
        </div>
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="pt-16 min-h-screen bg-midnight">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Error message="Lecture not found" />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-midnight">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <button onClick={() => navigate('/program')} className="hover:text-electric transition-colors">
            Programs
          </button>
          <ApperIcon name="ChevronRight" size={16} />
          {program && (
            <>
              <button 
                onClick={() => navigate(`/program/${program.slug}`)} 
                className="hover:text-electric transition-colors"
              >
                {program.title}
              </button>
              <ApperIcon name="ChevronRight" size={16} />
            </>
          )}
          <span className="text-white">{lecture.title}</span>
        </nav>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Video Player */}
            <div className="bg-navy-card rounded-xl overflow-hidden mb-8 border border-electric/20">
              <div className="aspect-video bg-gradient-to-br from-electric/20 to-navy-light flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-electric/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="Play" size={32} className="text-electric ml-1" />
                  </div>
                  <p className="text-white font-medium">Video Player Placeholder</p>
                  <p className="text-gray-400 text-sm">Video would load from: {lecture.video_url}</p>
                </div>
              </div>
              
              {/* Video Controls */}
              <div className="p-4 bg-navy-light border-t border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button size="sm">
                      <ApperIcon name="Play" size={16} className="mr-2" />
                      Play
                    </Button>
                    <div className="flex items-center text-sm text-gray-400">
                      <ApperIcon name="Clock" size={16} className="mr-1" />
                      {formatDuration(lecture.duration)}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <ApperIcon name="Settings" size={16} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ApperIcon name="Maximize" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Lecture Info */}
            <div className="bg-navy-card rounded-xl p-6 border border-electric/20">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant={getLevelBadgeVariant(lecture.level)}>
                    {lecture.level.replace('_', ' ')}
                  </Badge>
                  <Badge variant="default">
                    {lecture.category}
                  </Badge>
                </div>
                
                <div className="flex items-center text-sm text-gray-400">
                  <ApperIcon name="Clock" size={16} className="mr-1" />
                  {formatDuration(lecture.duration)}
                </div>
              </div>
              
              <h1 className="text-3xl font-display font-bold text-white mb-4">
                {lecture.title}
              </h1>
              
              <p className="text-gray-300 leading-relaxed">
                {lecture.description}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {program && (
              <div className="bg-navy-card rounded-xl p-6 border border-electric/20 mb-6">
                <h3 className="font-semibold text-white mb-2">Part of Program</h3>
                <h4 className="text-electric font-medium mb-2">{program.title}</h4>
                <p className="text-sm text-gray-400 mb-4">
                  {program.description.substring(0, 100)}...
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate(`/program/${program.slug}`)}
                  className="w-full"
                >
                  View Full Program
                  <ApperIcon name="ArrowRight" size={16} className="ml-2" />
                </Button>
              </div>
            )}

            {/* Lecture Navigation */}
            <div className="bg-navy-card rounded-xl p-6 border border-electric/20">
              <h3 className="font-semibold text-white mb-4">Lecture Navigation</h3>
              
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <ApperIcon name="ChevronLeft" size={16} className="mr-2" />
                  Previous Lecture
                </Button>
                
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <ApperIcon name="ChevronRight" size={16} className="mr-2" />
                  Next Lecture
                </Button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-600">
                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>1 of 5</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-electric h-2 rounded-full" style={{width: '20%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureDetailPage;