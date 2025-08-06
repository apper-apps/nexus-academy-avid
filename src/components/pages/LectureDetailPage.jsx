import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProgramById } from "@/services/api/programService";
import { getLectureById, getLecturesByCategoryAndProgram } from "@/services/api/lectureService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const LectureDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [lecture, setLecture] = useState(null);
  const [program, setProgram] = useState(null);
  const [relatedLectures, setRelatedLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [error, setError] = useState("");

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getLevelBadgeVariant = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'error';
      case 'master_common':
        return 'info';
      default:
        return 'default';
    }
  };

  const loadRelatedLectures = async (lecture, program) => {
    if (!lecture?.category || !program || program.type !== 'member') {
      setRelatedLectures([]);
      return;
    }

    try {
      setRelatedLoading(true);
      const related = await getLecturesByCategoryAndProgram(lecture.category, lecture.program_id?.Id || lecture.program_id);
      // Filter out current lecture
      const filtered = related.filter(l => l.Id !== parseInt(id));
      setRelatedLectures(filtered);
    } catch (err) {
      console.error("Error loading related lectures:", err.message);
      setRelatedLectures([]);
    } finally {
      setRelatedLoading(false);
    }
  };

  const loadLectureData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const lectureData = await getLectureById(id);
      
      if (!lectureData) {
        throw new Error(`Lecture with ID ${id} not found`);
      }
      
      setLecture(lectureData);
      
      let programData = null;
      // Handle both object and direct ID cases for program_id
      const programId = lectureData.program_id?.Id || lectureData.program_id;
      if (programId) {
        try {
          programData = await getProgramById(programId);
          setProgram(programData);
        } catch (programErr) {
          console.error("Error loading associated program:", programErr.message);
          setProgram(null);
        }
      }

      // Load related lectures if this is a membership program
      await loadRelatedLectures(lectureData, programData);
    } catch (err) {
      console.error("Error loading lecture data:", err.message);
      setError(err.message || "Failed to load lecture. The lecture record may not exist.");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (lectureId) => {
    if (lectureId) {
      navigate(`/lecture/${lectureId}`);
    }
  };

  const handleBackToCourse = () => {
    if (program) {
      if (program.type === 'master') {
        navigate(`/program/master/${program.slug}`);
      } else {
        navigate(`/program/${program.slug}`);
      }
    } else {
      navigate('/program');
    }
  };

  useEffect(() => {
    loadLectureData();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!lecture) return <Error message="Lecture not found" />;

  const hasNavigation = lecture.previous_lecture_id || lecture.next_lecture_id;
  const isMembershipProgram = program?.type === 'member';

  return (
    <div className="min-h-screen bg-midnight">
      <div className="flex flex-col lg:flex-row">
        {/* Main Video Area */}
        <div className="flex-1 lg:pr-8">
          {/* Video Player */}
          <div className="relative w-full bg-navy-card rounded-lg overflow-hidden shadow-lg mb-6">
            <div className="aspect-video">
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
                <div className="w-full h-full bg-navy-light flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <ApperIcon name="Play" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Video not available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation (below video on mobile) */}
          <div className="lg:hidden mb-6">
            <div className="bg-navy-card rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Button
                  onClick={handleBackToCourse}
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="ArrowLeft" size={16} />
                  Back to Course
                </Button>
              </div>

              {hasNavigation && (
                <div className="flex items-center justify-between gap-4">
                  <Button
                    onClick={() => handleNavigation(lecture.previous_lecture_id?.Id || lecture.previous_lecture_id)}
                    disabled={!lecture.previous_lecture_id}
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-2 flex-1"
                  >
                    <ApperIcon name="ChevronLeft" size={16} />
                    Previous
                  </Button>

                  <Button
                    onClick={() => handleNavigation(lecture.next_lecture_id?.Id || lecture.next_lecture_id)}
                    disabled={!lecture.next_lecture_id}
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-2 flex-1"
                  >
                    Next
                    <ApperIcon name="ChevronRight" size={16} />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Lecture Info */}
          <div className="lg:hidden mb-6">
            <div className="bg-navy-card rounded-lg p-6">
              <h1 className="text-2xl font-bold text-white mb-4">{lecture.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <ApperIcon name="Clock" size={16} />
                  <span>{formatDuration(lecture.duration)}</span>
                </div>
                
                <Badge variant={getLevelBadgeVariant(lecture.level)} size="sm">
                  {lecture.level?.charAt(0).toUpperCase() + lecture.level?.slice(1) || 'Unknown'}
                </Badge>

                {lecture.category && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <ApperIcon name="Tag" size={16} />
                    <span>{lecture.category}</span>
                  </div>
                )}
              </div>

              {lecture.description && (
                <div className="text-gray-300 leading-relaxed">
                  <p>{lecture.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Fixed Sidebar */}
        <div className="hidden lg:block w-96 flex-shrink-0">
          <div className="sticky top-6 space-y-6">
            {/* Course Navigation */}
            <div className="bg-navy-card rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Course Navigation</h3>
              
              <div className="space-y-3">
                <Button
                  onClick={handleBackToCourse}
                  variant="secondary"
                  size="sm"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <ApperIcon name="ArrowLeft" size={16} />
                  Back to Course
                </Button>

                {hasNavigation && (
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => handleNavigation(lecture.previous_lecture_id?.Id || lecture.previous_lecture_id)}
                      disabled={!lecture.previous_lecture_id}
                      variant="secondary"
                      size="sm"
                      className="flex items-center justify-center gap-2"
                    >
                      <ApperIcon name="ChevronLeft" size={16} />
                      Previous
                    </Button>

                    <Button
                      onClick={() => handleNavigation(lecture.next_lecture_id?.Id || lecture.next_lecture_id)}
                      disabled={!lecture.next_lecture_id}
                      variant="secondary" 
                      size="sm"
                      className="flex items-center justify-center gap-2"
                    >
                      Next
                      <ApperIcon name="ChevronRight" size={16} />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Lecture Information */}
            <div className="bg-navy-card rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Lecture Information</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2">{lecture.title}</h4>
                  {lecture.description && (
                    <p className="text-gray-300 text-sm leading-relaxed">{lecture.description}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Duration</span>
                    <div className="flex items-center gap-2 text-gray-300">
                      <ApperIcon name="Clock" size={16} />
                      <span>{formatDuration(lecture.duration)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Level</span>
                    <Badge variant={getLevelBadgeVariant(lecture.level)} size="sm">
                      {lecture.level?.charAt(0).toUpperCase() + lecture.level?.slice(1) || 'Unknown'}
                    </Badge>
                  </div>

                  {lecture.category && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Category</span>
                      <div className="flex items-center gap-2 text-gray-300">
                        <ApperIcon name="Tag" size={16} />
                        <span>{lecture.category}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Progress</span>
                    <div className="flex items-center gap-2 text-electric">
                      <ApperIcon name="Play" size={16} />
                      <span>Watching</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Lectures (for Membership courses only) */}
            {isMembershipProgram && (
              <div className="bg-navy-card rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  More in {lecture.category}
                </h3>
                
                {relatedLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-shimmer h-16 bg-navy-light rounded-lg" />
                    ))}
                  </div>
                ) : relatedLectures.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {relatedLectures.map((relatedLecture) => (
                      <button
                        key={relatedLecture.Id}
                        onClick={() => navigate(`/lecture/${relatedLecture.Id}`)}
                        className="w-full p-3 bg-navy-light hover:bg-navy-light/80 rounded-lg text-left transition-colors group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-electric/10 rounded-full flex items-center justify-center group-hover:bg-electric/20 transition-colors">
                            <ApperIcon name="Play" size={14} className="text-electric" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white text-sm font-medium mb-1 line-clamp-2">
                              {relatedLecture.title}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                              <span>{formatDuration(relatedLecture.duration)}</span>
                              {relatedLecture.level && (
                                <span className="capitalize">{relatedLecture.level}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No other lectures in this category</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureDetailPage;