import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import FormField from '@/components/molecules/FormField';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { getUserById, updateUser } from '@/services/api/userService';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    master_cohort: ""
  });

  const currentUserId = 1; // Mock current user ID

const loadUser = async () => {
    try {
      setLoading(true);
      setError("");
      const userData = await getUserById(currentUserId);
      
      if (!userData) {
        throw new Error(`Profile not found for user ID ${currentUserId}`);
      }
      
      setUser(userData);
      setFormData({
        name: userData.Name || userData.name || "",
        email: userData.email || "",
        role: userData.role || "",
        master_cohort: userData.master_cohort || ""
      });
    } catch (err) {
      console.error("Error loading user profile:", err.message);
      setError(err.message || "Failed to load profile. The user record may not exist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const updatedUser = await updateUser(currentUserId, formData);
      setUser(updatedUser);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      master_cohort: user.master_cohort || ""
    });
    setIsEditing(false);
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'master':
        return 'primary';
      case 'member':
        return 'success';
      case 'both':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-midnight">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Loading type="hero" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-midnight">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Error message={error} onRetry={loadUser} />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-16 min-h-screen bg-midnight">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Error message="Profile not found" />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-midnight">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-electric rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="User" size={32} className="text-white" />
          </div>
          
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            {user.name}
          </h1>
          
          <p className="text-gray-400 mb-4">{user.email}</p>
          
          <div className="flex justify-center space-x-3">
            <Badge variant={getRoleBadgeVariant(user.role)} size="md">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Account
            </Badge>
            
            {user.is_admin && (
              <Badge variant="warning" size="md">
                <ApperIcon name="Shield" size={14} className="mr-1" />
                Admin
              </Badge>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2">
            <div className="bg-navy-card rounded-xl p-6 border border-electric/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    <ApperIcon name="Edit2" size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button variant="ghost" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="Save" size={16} className="mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-6">
                  <FormField
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  
                  <FormField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Account Role
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-navy-card border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-electric focus:border-electric"
                      >
                        <option value="free">Free</option>
                        <option value="member">Member</option>
                        <option value="master">Master</option>
                        <option value="both">Both</option>
                      </select>
                    </div>
                    
                    <FormField
                      label="Master Cohort"
                      name="master_cohort"
                      value={formData.master_cohort}
                      onChange={handleInputChange}
                      placeholder="e.g., 2024-Q1"
                    />
                  </div>
                </form>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                    <p className="text-white">{user.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                    <p className="text-white">{user.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Account Role</label>
                    <p className="text-white capitalize">{user.role}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Master Cohort</label>
                    <p className="text-white">{user.master_cohort || "N/A"}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Member Since</label>
                    <p className="text-white">{new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Admin Status</label>
                    <p className="text-white">{user.is_admin ? "Yes" : "No"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Account Overview */}
            <div className="bg-navy-card rounded-xl p-6 border border-electric/20 mb-6">
              <h3 className="font-semibold text-white mb-4">Account Overview</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Programs Enrolled</span>
                  <span className="text-white font-medium">2</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Lectures Completed</span>
                  <span className="text-white font-medium">15</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Community Posts</span>
                  <span className="text-white font-medium">8</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Achievement Score</span>
                  <span className="text-electric font-medium">95%</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-navy-card rounded-xl p-6 border border-electric/20">
              <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Button variant="ghost" className="w-full justify-start">
                  <ApperIcon name="BookOpen" size={16} className="mr-3" />
                  Continue Learning
                </Button>
                
                <Button variant="ghost" className="w-full justify-start">
                  <ApperIcon name="Users" size={16} className="mr-3" />
                  Community Forum
                </Button>
                
                <Button variant="ghost" className="w-full justify-start">
                  <ApperIcon name="Award" size={16} className="mr-3" />
                  Certificates
                </Button>
                
                <Button variant="ghost" className="w-full justify-start">
                  <ApperIcon name="Settings" size={16} className="mr-3" />
                  Account Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;