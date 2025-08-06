import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import AdminUsersTab from '@/components/organisms/AdminUsersTab';
import AdminProgramsTab from '@/components/organisms/AdminProgramsTab';
import AdminLecturesTab from '@/components/organisms/AdminLecturesTab';
import AdminPostsTab from '@/components/organisms/AdminPostsTab';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('users');

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
              <h1 className="text-3xl font-display font-bold text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-400">Manage users, programs, lectures, and content</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-electric text-electric'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
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