import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getProgramBySlug } from "@/services/api/programService";
import { getLecturesByProgram } from "@/services/api/lectureService";
import { addToWaitlist } from "@/services/api/waitlistService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const ProgramMasterDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  
  const [program, setProgram] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCohort, setSelectedCohort] = useState("");
  const [courseType, setCourseType] = useState("common"); // "common" or "cohort"
  const [openAccordion, setOpenAccordion] = useState(null);
  const [email, setEmail] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  // Check if user has master access
  const hasMasterAccess = () => {
    if (!isAuthenticated || !user) return false;
    return user.role === "master" || user.role === "both";
  };

  // Check if user is admin
  const isAdmin = () => {
    return user && user.is_admin;
  };

  // Load program and lecture data
  const loadProgramData = async () => {
    try {
      setLoading(true);
      const programData = await getProgramBySlug(slug);
      
      if (!programData) {
        setError("Program not found");
        return;
      }
      
      setProgram(programData);
      
      // Set default cohort from user if available
      if (user?.master_cohort && !selectedCohort) {
        setSelectedCohort(user.master_cohort);
      }
      
      // Load lectures if user has access and program exists
      if (hasMasterAccess() && programData.Id) {
        try {
          const lectureData = await getLecturesByProgram(programData.Id);
          setLectures(lectureData || []);
        } catch (lectureErr) {
          console.error("Error loading program lectures:", lectureErr.message);
          setLectures([]);
        }
      }
    } catch (err) {
      console.error("Error loading program data:", err.message);
      setError(err.message || "Failed to load program");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgramData();
  }, [slug, isAuthenticated, user]);

  // Handle waitlist join
  const handleJoinWaitlist = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setIsJoining(true);
      await addToWaitlist({
        email: email.trim(),
        program_slug: slug,
        program_name: program?.title || slug
      });
      toast.success("Successfully joined the waitlist!");
      setEmail("");
    } catch (error) {
      console.error("Error joining waitlist:", error.message);
      toast.error("Failed to join waitlist. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  // Filter lectures based on course type and cohort
  const getFilteredLectures = () => {
    if (!lectures.length) return [];
    
    if (courseType === "common") {
      return lectures.filter(lecture => lecture.level === "master_common");
    } else {
      return lectures.filter(lecture => 
        lecture.level === "master" && 
        lecture.cohort_number === selectedCohort
      );
    }
  };

  // Handle accordion toggle
  const handleAccordionToggle = (lectureId) => {
    setOpenAccordion(openAccordion === lectureId ? null : lectureId);
  };

  // Get available cohorts from user's master_cohort or generate options
  const getCohortOptions = () => {
    if (user?.master_cohort) {
      // Generate a few cohort options around user's cohort
      const userCohort = parseInt(user.master_cohort) || 1;
      return Array.from({ length: 5 }, (_, i) => (userCohort - 2 + i).toString()).filter(c => parseInt(c) > 0);
    }
    return ["1", "2", "3", "4", "5"];
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-midnight">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-midnight">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Error message={error} />
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

  const filteredLectures = getFilteredLectures();

  return (
    <div className="pt-16 min-h-screen bg-midnight">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <button 
            onClick={() => navigate('/program/master')} 
            className="hover:text-electric transition-colors"
          >
            Master Programs
          </button>
          <ApperIcon name="ChevronRight" size={16} />
          <span className="text-white">{program.title}</span>
        </nav>

        {/* Blue Gradient Banner */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 rounded-2xl p-8 mb-8 overflow-hidden">
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-display font-bold text-white mb-2">
                {program.title}
              </h1>
              <p className="text-blue-100 text-lg">
                {program.description_short || program.description}
              </p>
            </div>
            {isAdmin() && hasMasterAccess() && (
              <Button
                onClick={() => navigate(`/admin/lectures?program=${program.Id}`)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                variant="outline"
              >
                <ApperIcon name="Plus" size={16} className="mr-2" />
                강의 추가
              </Button>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
        </div>

        {hasMasterAccess() ? (
          <>
            {/* Controls */}
            <div className="bg-navy-card rounded-xl p-6 mb-8 border border-electric/10">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                {/* Cohort Dropdown */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    기수 선택
                  </label>
                  <select
                    value={selectedCohort}
                    onChange={(e) => setSelectedCohort(e.target.value)}
                    className="w-full px-4 py-2 bg-midnight border border-gray-600 rounded-lg text-white focus:border-electric focus:ring-1 focus:ring-electric"
                  >
                    {getCohortOptions().map(cohort => (
                      <option key={cohort} value={cohort}>
                        {cohort}기
                      </option>
                    ))}
                  </select>
                </div>

                {/* Course Type Toggle */}
                {program.has_common_course && (
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      과정 유형
                    </label>
                    <div className="flex bg-midnight rounded-lg p-1 border border-gray-600">
                      <button
                        onClick={() => setCourseType("common")}
                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          courseType === "common"
                            ? "bg-electric text-white"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        공통 과정
                      </button>
                      <button
                        onClick={() => setCourseType("cohort")}
                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          courseType === "cohort"
                            ? "bg-electric text-white"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        해당 기수 과정
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Lectures Accordion */}
            <div className="space-y-4">
              {filteredLectures.length === 0 ? (
                <div className="bg-navy-card rounded-xl p-8 text-center border border-electric/10">
                  <ApperIcon name="BookOpen" size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    No lectures available
                  </h3>
                  <p className="text-gray-400">
                    {courseType === "common" 
                      ? "No common course lectures found for this program."
                      : `No lectures found for cohort ${selectedCohort}.`
                    }
                  </p>
                </div>
              ) : (
                filteredLectures.map((lecture) => (
                  <div key={lecture.Id} className="bg-navy-card rounded-xl border border-electric/10 overflow-hidden">
                    <button
                      onClick={() => handleAccordionToggle(lecture.Id)}
                      className="w-full p-6 text-left hover:bg-navy-light transition-colors flex justify-between items-center"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {lecture.title}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {lecture.description}
                        </p>
                        {lecture.duration && (
                          <span className="inline-block mt-2 px-2 py-1 bg-electric/10 text-electric text-xs rounded-full">
                            {Math.floor(lecture.duration / 60)}분
                          </span>
                        )}
                      </div>
                      <ApperIcon 
                        name={openAccordion === lecture.Id ? "ChevronUp" : "ChevronDown"} 
                        size={20} 
                        className="text-gray-400"
                      />
                    </button>
                    
                    {openAccordion === lecture.Id && (
                      <div className="border-t border-gray-600 p-6">
                        {lecture.embed_url ? (
                          <div className="aspect-video w-full rounded-lg overflow-hidden bg-black mb-4">
                            <iframe
                              src={lecture.embed_url}
                              className="w-full h-full"
                              allowFullScreen
                              title={lecture.title}
                            />
                          </div>
                        ) : lecture.video_url ? (
                          <div className="aspect-video w-full rounded-lg overflow-hidden bg-black mb-4">
                            <iframe
                              src={lecture.video_url}
                              className="w-full h-full"
                              allowFullScreen
                              title={lecture.title}
                            />
                          </div>
                        ) : (
                          <div className="aspect-video w-full rounded-lg bg-gray-800 flex items-center justify-center mb-4">
                            <div className="text-center">
                              <ApperIcon name="Play" size={48} className="text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-400">Video not available</p>
                            </div>
                          </div>
                        )}
                        
                        {lecture.description && (
                          <div className="text-gray-300">
                            <h4 className="font-semibold mb-2">강의 소개</h4>
                            <p className="text-sm leading-relaxed whitespace-pre-line">
                              {lecture.description}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          /* Waitlist Registration for Non-Master Users */
          <div className="max-w-2xl mx-auto">
            <div className="bg-navy-card rounded-2xl p-8 border border-electric/20 text-center">
              <ApperIcon name="Lock" size={64} className="text-electric mx-auto mb-6" />
              <h2 className="text-2xl font-display font-bold text-white mb-4">
                Master Program Access Required
              </h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                {program.description || "This is an exclusive master program with advanced content and features."}
              </p>
              
              <form onSubmit={handleJoinWaitlist} className="space-y-4">
                <FormField
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  disabled={isJoining}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isJoining ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="UserPlus" size={16} className="mr-2" />
                      Join Wait‑list
                    </>
                  )}
                </Button>
              </form>
              
              <p className="text-xs text-gray-400 mt-4">
                Join the waitlist to be notified when this program becomes available to you.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramMasterDetailPage;