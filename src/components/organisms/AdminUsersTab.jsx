import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import AdminTable from '@/components/organisms/AdminTable';
import FormField from '@/components/molecules/FormField';
import { getUsers, createUser, updateUser, deleteUser } from '@/services/api/userService';

const AdminUsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "free",
    master_cohort: "",
    is_admin: false
  });

  const columns = [
    { field: "name", header: "Name", sortable: true },
    { field: "email", header: "Email", sortable: true },
    { 
      field: "role", 
      header: "Role", 
      type: "badge",
      badgeVariant: "primary",
      sortable: true 
    },
    { field: "master_cohort", header: "Master Cohort", sortable: true },
    { field: "is_admin", header: "Admin", type: "boolean", sortable: true },
    { field: "created_at", header: "Created", type: "date", sortable: true }
  ];

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "free",
      master_cohort: "",
      is_admin: false
    });
    setEditingUser(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      master_cohort: user.master_cohort || "",
      is_admin: user.is_admin
    });
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (user) => {
    if (!confirm(`Are you sure you want to delete user "${user.name}"?`)) return;
    
    try {
      await deleteUser(user.Id);
      setUsers(prev => prev.filter(u => u.Id !== user.Id));
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        const updatedUser = await updateUser(editingUser.Id, formData);
        setUsers(prev => prev.map(u => u.Id === editingUser.Id ? updatedUser : u));
        toast.success("User updated successfully!");
      } else {
        const newUser = await createUser(formData);
        setUsers(prev => [newUser, ...prev]);
        toast.success("User created successfully!");
      }
      
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Users</h2>
          <p className="text-gray-400">Manage user accounts and permissions</p>
        </div>
        <Button onClick={handleCreate}>
          <ApperIcon name="UserPlus" size={16} className="mr-2" />
          Add User
        </Button>
      </div>

      <AdminTable
        data={users}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={loadUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No users found"
        emptyIcon="Users"
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-navy-card rounded-xl p-6 w-full max-w-md border border-electric/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                {editingUser ? 'Edit User' : 'Create User'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              
              <FormField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Role
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
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_admin"
                  name="is_admin"
                  checked={formData.is_admin}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="is_admin" className="text-sm text-gray-200">
                  Admin privileges
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingUser ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersTab;