import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import { getPrograms } from '@/services/api/programService';

const NavigationDropdown = ({ label, items, className = "", currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        setLoading(true);
        const data = await getPrograms();
        setPrograms(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (label === 'Program') {
      loadPrograms();
    }
  }, [label]);

  const handleItemClick = (item) => {
    if (item.href) {
      navigate(item.href);
    }
    setIsOpen(false);
  };

  // Generate dynamic program items if this is the Program dropdown
  const getDropdownItems = () => {
    if (label === 'Program') {
      const programItems = [];
      
      // Add member programs
      const memberPrograms = programs.filter(p => p.type === 'member');
      if (memberPrograms.length > 0) {
        programItems.push({
          title: "Member Programs",
          description: "Build your foundation",
          icon: "Users",
          href: "/program"
        });
      }

      // Add master programs
      const masterPrograms = programs.filter(p => p.type === 'master');
      if (masterPrograms.length > 0) {
        programItems.push({
          title: "Master Programs",
          description: "Master your skills",
          icon: "Crown",
          href: "/program/master"
        });
      }

      // Add admin option if applicable
      if (currentUser?.is_admin) {
        programItems.push({
          title: "➕ Add Program",
          description: "Create new program",
          icon: "Plus",
          href: "/admin/programs/new"
        });
      }

      return programItems;
    }

    return items || [];
  };

  const dropdownItems = getDropdownItems();

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-white hover:text-electric transition-colors duration-200 py-2"
      >
        <span>{label}</span>
        <ApperIcon 
          name="ChevronDown" 
          size={16} 
          className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-navy-card border border-gray-600 rounded-lg shadow-xl z-50 glass-strong">
          <div className="py-2">
            {loading ? (
              <div className="px-4 py-3 text-center">
                <ApperIcon name="Loader2" size={16} className="animate-spin text-electric mx-auto" />
              </div>
            ) : error ? (
              <div className="px-4 py-3 text-center text-red-400 text-sm">
                Failed to load programs
              </div>
            ) : dropdownItems.length === 0 ? (
              <div className="px-4 py-3 text-center text-gray-400 text-sm">
                No programs available
              </div>
            ) : (
              dropdownItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleItemClick(item)}
                  className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-navy-light/50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    {item.icon && (
                      <ApperIcon name={item.icon} size={16} className="text-electric" />
                    )}
                    <div>
                      <div className="font-medium">{item.title}</div>
                      {item.description && (
                        <div className="text-sm text-gray-400">{item.description}</div>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationDropdown;