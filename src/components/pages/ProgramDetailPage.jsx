import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getProgramBySlug } from "@/services/api/programService";
import { addToWaitlist } from "@/services/api/waitlistService";
import { getLecturesByProgram } from "@/services/api/lectureService";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import LectureCard from "@/components/molecules/LectureCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const ProgramDetailPage = ({ currentUser }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [program, setProgram] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Helper function to check if user has access to lectures
  const hasLectureAccess = () => {
    if (!currentUser) return false;
    return currentUser.role === "member" || currentUser.role === "both";
  };

  // Helper function to check if user is admin
  const isAdmin = () => {
    return currentUser && currentUser.is_admin;
};

  // Helper function to check if user can enter the course
  const canEnterCourse = () => {
    if (!currentUser) return false;
    return currentUser.role === "member" || currentUser.role === "both";
  };

  const handleAddLecture = () => {
    navigate('/admin/lectures');
    toast.success('Redirecting to lecture management...');
  };
const loadProgramData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const programData = await getProgramBySlug(slug);
      
      if (!programData) {
        throw new Error(`Program with slug "${slug}" not found`);
      }
      
      setProgram(programData);
      
      // Only try to load lectures if program exists and has an ID
      if (programData.Id) {
        try {
          const lectureData = await getLecturesByProgram(programData.Id);
          setLectures(lectureData || []);
        } catch (lectureErr) {
          console.error("Error loading program lectures:", lectureErr.message);
          // Don't fail the entire page if lectures can't be loaded
          setLectures([]);
        }
      } else {
        setLectures([]);
      }
    } catch (err) {
      console.error("Error loading program data:", err.message);
      setError(err.message || "Failed to load program. The program may not exist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgramData();
  }, [slug]);

  const handleJoinWaitlist = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setIsJoining(true);
      await addToWaitlist(email, slug);
      toast.success("Successfully added to waitlist! We'll notify you when enrollment opens.");
      setEmail("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsJoining(false);
    }
  };

  const categories = ["all", ...new Set(lectures.map(l => l.category))];
  const filteredLectures = selectedCategory === "all" 
    ? lectures 
    : lectures.filter(l => l.category === selectedCategory);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-midnight">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Loading type="hero" className="mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Loading type="cards" className="grid md:grid-cols-2 gap-6" />
            </div>
            <div>
              <Loading className="h-[400px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-midnight">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Error message={error} onRetry={loadProgramData} />
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="pt-16 min-h-screen bg-midnight">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Error message="Program not found" />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-midnight">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <button onClick={() => navigate('/program')} className="hover:text-electric transition-colors">
            Programs
          </button>
          <ApperIcon name="ChevronRight" size={16} />
          <span className="text-white">{program.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Program Header */}
            <div className="mb-8">
              <Badge variant="primary" size="md" className="mb-4">
                {program.type === 'member' ? 'Member Program' : 'Master Program'}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                {program.title}
              </h1>
              
              <p className="text-xl text-gray-300 mb-6">
                {program.description}
              </p>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center text-gray-400">
                  <ApperIcon name="Clock" size={20} className="mr-2" />
                  <span>Self-paced learning</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <ApperIcon name="Users" size={20} className="mr-2" />
                  <span>Community access</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <ApperIcon name="Award" size={20} className="mr-2" />
                  <span>Certificate of completion</span>
                </div>
                {program.has_common_course && (
                  <div className="flex items-center text-gray-400">
                    <ApperIcon name="Star" size={20} className="mr-2" />
                    <span>Common course included</span>
                  </div>
                )}
              </div>
            </div>

            {/* Lectures Section */}
            <div>
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white mb-4 sm:mb-0">
                  Course Content ({lectures.length} lectures)
                </h2>
                {isAdmin() && (
                  <Button
                    onClick={handleAddLecture}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <ApperIcon name="Plus" size={16} />
                    Add Lecture
                  </Button>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-electric text-white'
                          : 'bg-navy-card text-gray-400 hover:text-white hover:bg-navy-light'
                      }`}
                    >
                      {category === 'all' ? 'All' : category}
                    </button>
                  ))}
                </div>
              </div>

              {filteredLectures.length > 0 ? (
<div className="grid md:grid-cols-2 gap-6">
                  {filteredLectures.map((lecture, index) => {
                    const canAccess = hasLectureAccess() || index === 0;
                    const isLocked = !canAccess;
                    
                    return (
                      <LectureCard 
                        key={lecture.Id} 
                        lecture={lecture} 
                        isLocked={isLocked}
                        currentUser={currentUser}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <ApperIcon name="BookOpen" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No lectures found for the selected category.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-navy-card rounded-xl p-6 border border-electric/20 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-electric mb-2">
                  ${program.price.toLocaleString()}
                </div>
                <div className="text-gray-400">One-time payment</div>
              </div>

              <form onSubmit={handleJoinWaitlist} className="space-y-4">
                <FormField
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
                
{canEnterCourse() ? (
                  <Button 
                    className="w-full bg-electric hover:bg-electric-hover" 
                    onClick={() => navigate(`/program/${slug}/lectures`)}
                  >
                    <ApperIcon name="PlayCircle" size={16} className="mr-2" />
                    Enter Course
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isJoining}
                  >
                    {isJoining ? (
                      <>
                        <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                        Joining Waitlist...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="UserPlus" size={16} className="mr-2" />
                        Join Waitlist
                      </>
                    )}
                  </Button>
                )}
              </form>

              <div className="mt-6 pt-6 border-t border-gray-600">
                <div className="space-y-3 text-sm text-gray-400">
                  <div className="flex items-center">
                    <ApperIcon name="Shield" size={16} className="mr-2 text-electric" />
                    30-day money back guarantee
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name="Infinity" size={16} className="mr-2 text-electric" />
                    Lifetime access to content
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name="MessageCircle" size={16} className="mr-2 text-electric" />
                    Community support
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/reviews')}
                  className="text-electric hover:text-electric-hover transition-colors text-sm"
                >
                  Read student testimonials →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailPage;