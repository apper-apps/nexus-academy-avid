import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import AdminUsersTab from "@/components/organisms/AdminUsersTab";
import AdminLecturesTab from "@/components/organisms/AdminLecturesTab";
import AdminPostsTab from "@/components/organisms/AdminPostsTab";
import AdminProgramsTab from "@/components/organisms/AdminProgramsTab";
import Button from "@/components/atoms/Button";

const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('users');
  
  // Show dashboard only for /admin route, not sub-routes
  if (location.pathname === '/admin') {
    const adminCards = [
      {
        id: 'users',
        title: 'Users',
        icon: 'Users',
        route: '/admin/users'
      },
      {
        id: 'programs',
        title: 'Programs',
        icon: 'BookOpen',
        route: '/admin/programs'
      },
      {
        id: 'lectures',
        title: 'Lectures',
        icon: 'Presentation',
        route: '/admin/lectures'
      },
      {
        id: 'posts',
        title: 'Posts',
        icon: 'FileText',
        route: '/admin/posts'
      }
    ];

    return (
      <div className="min-h-screen bg-midnight text-white">
        <div className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400 mt-2">Manage your application content and users</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              {adminCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => navigate(card.route)}
                  className="group cursor-pointer bg-navy-card border border-electric rounded-lg p-8 hover:bg-electric transition-all duration-200 transform hover:scale-105"
                >
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="text-electric group-hover:text-white transition-colors duration-200">
                      <ApperIcon name={card.icon} size={48} />
                    </div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-white">
                      {card.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'users', label: 'Users', icon: 'Users' },
    { id: 'programs', label: 'Programs', icon: 'BookOpen' },
    { id: 'lectures', label: 'Lectures', icon: 'Play' },
    { id: 'posts', label: 'Posts', icon: 'FileText' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <AdminUsersTab />;
      case 'programs':
        return <AdminProgramsTab />;
      case 'lectures':
        return <AdminLecturesTab />;
      case 'posts':
        return <AdminPostsTab />;
      default:
        return <AdminUsersTab />;
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-midnight">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-electric/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="Shield" size={20} className="text-electric" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400">Manage users, programs, lectures, and content</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id 
                      ? "border-electric text-electric" 
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <ApperIcon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-navy-card/30 rounded-xl p-6 border border-gray-700/50">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;