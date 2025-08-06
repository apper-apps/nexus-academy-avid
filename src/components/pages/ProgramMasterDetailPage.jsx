import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ProgramMasterDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  return (
    <div className="pt-16 min-h-screen bg-midnight">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <button 
            onClick={() => navigate('/program/master')} 
            className="hover:text-electric transition-colors"
          >
            Master Programs
          </button>
          <ApperIcon name="ChevronRight" size={16} />
          <span className="text-white">{slug}</span>
        </nav>

        {/* Main Content */}
        <div className="text-center py-20">
          <div className="bg-navy-card rounded-2xl p-12 border border-electric/20 max-w-2xl mx-auto">
            <ApperIcon name="Crown" size={64} className="text-electric mx-auto mb-6" />
            <h1 className="text-4xl font-display font-bold text-white mb-4">
              Master Program: {slug}
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              This master program page is coming soon. Stay tuned for advanced content and exclusive features.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/program/master')}
                className="bg-electric hover:bg-electric-hover"
              >
                <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
                Back to Master Programs
              </Button>
              <Button 
                variant="ghost"
                onClick={() => navigate('/program')}
                className="text-gray-400 hover:text-white"
              >
                View All Programs
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramMasterDetailPage;