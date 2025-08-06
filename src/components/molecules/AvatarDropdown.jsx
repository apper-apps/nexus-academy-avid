import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const AvatarDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleProfileClick = () => {
    navigate('/profile');
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout?.();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 bg-electric rounded-full flex items-center justify-center hover:bg-electric-hover transition-colors duration-200"
      >
        <ApperIcon name="User" size={16} className="text-white" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-navy-card border border-gray-600 rounded-lg shadow-xl z-50 glass-strong">
          <div className="p-4 border-b border-gray-600">
            <div className="font-medium text-white">{user?.name}</div>
            <div className="text-sm text-gray-400">{user?.email}</div>
            <div className="text-xs text-electric mt-1 capitalize">{user?.role} Account</div>
          </div>
          
          <div className="py-2">
            <button
              onClick={handleProfileClick}
              className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-navy-light/50 transition-colors duration-200 flex items-center space-x-3"
            >
              <ApperIcon name="User" size={16} className="text-electric" />
              <span>Profile</span>
            </button>
            
            <button
              onClick={handleLogoutClick}
              className="w-full text-left px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-navy-light/50 transition-colors duration-200 flex items-center space-x-3"
            >
              <ApperIcon name="LogOut" size={16} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;