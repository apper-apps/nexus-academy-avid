import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import NavigationDropdown from "@/components/molecules/NavigationDropdown";
import AvatarDropdown from "@/components/molecules/AvatarDropdown";
import Button from "@/components/atoms/Button";

const TopNavigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

const { user, isAuthenticated } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);
  
  const programDropdownItems = [
    {
      title: "Membership",
      description: "Build your foundation",
      icon: "Users",
      href: "/program/membership"
    },
    {
      title: "Master",
      description: "Master communication",
      icon: "MessageSquare",
      href: "/program/text-influencer"
    },
    ...(user?.is_admin ? [{
      title: "➕ Add Program",
      description: "Create new program",
      icon: "Plus",
      href: "/admin/programs/new"
    }] : [])
  ];

  const isActiveLink = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const NavLink = ({ to, children, mobile = false }) => {
    const isActive = isActiveLink(to);
    const baseClasses = "transition-colors duration-200";
    const mobileClasses = mobile ? "block px-3 py-2" : "";
    const activeClasses = isActive ? "text-electric" : "text-white hover:text-electric";
    
    return (
      <Link 
        to={to} 
        className={`${baseClasses} ${mobileClasses} ${activeClasses}`}
        onClick={() => mobile && setIsMobileMenuOpen(false)}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-electric rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">Nexus Academy</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <NavLink to="/">Home</NavLink>
              
<NavigationDropdown 
                label="Program"
                items={programDropdownItems}
                currentUser={user}
              />
              
              <NavLink to="/insight">Insight</NavLink>
              <NavLink to="/reviews">Reviews</NavLink>
              
{user && (
                <>
                  <NavLink to="/profile">Profile</NavLink>
                  {user.is_admin && (
                    <NavLink to="/admin">Admin</NavLink>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
{user ? (
              <AvatarDropdown 
                user={user} 
                onLogout={logout}
              />
            ) : (
<>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Log In
                </Button>
                <Button onClick={() => navigate('/signup')}>
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-electric transition-colors duration-200"
            >
              <ApperIcon 
                name={isMobileMenuOpen ? "X" : "Menu"} 
                size={24} 
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-navy-card border-t border-gray-600">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink to="/" mobile>Home</NavLink>
            <NavLink to="/program" mobile>Programs</NavLink>
            <NavLink to="/insight" mobile>Insight</NavLink>
            <NavLink to="/reviews" mobile>Reviews</NavLink>
            
{user ? (
              <>
                <NavLink to="/profile" mobile>Profile</NavLink>
                {user.is_admin && (
                  <NavLink to="/admin" mobile>Admin</NavLink>
                )}
<button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-white hover:text-electric transition-colors duration-200"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="px-3 py-2 space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => {
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Log In
                </Button>
                <Button 
                  className="w-full"
                  onClick={() => {
                    navigate('/signup');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNavigation;