import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deleteUser, getUsers, updateUser } from "@/services/api/userService";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import AdminTable from "@/components/organisms/AdminTable";
import Button from "@/components/atoms/Button";

const AdminUsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const columns = [
    { field: "Name", header: "Name", sortable: true },
    { field: "email", header: "Email", sortable: true, editable: false },
    { 
      field: "role", 
      header: "Role", 
      type: "badge",
      badgeVariant: "primary",
      sortable: true,
      editable: true,
      editType: "select",
      options: [
        { value: "free", label: "Free" },
        { value: "member", label: "Member" },
        { value: "master", label: "Master" },
        { value: "both", label: "Both" }
      ]
    },
    { 
      field: "master_cohort", 
      header: "Master Cohort", 
      sortable: true,
      editable: true,
      editType: "number"
    },
    { 
      field: "is_admin", 
      header: "Admin", 
      type: "boolean", 
      sortable: true,
      editable: true,
      editType: "checkbox"
    },
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

  const handleDelete = async (user) => {
    if (!confirm(`Are you sure you want to delete user "${user.Name}"?`)) return;
    
    try {
      await deleteUser(user.Id);
      setUsers(prev => prev.filter(u => u.Id !== user.Id));
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCellEdit = async (userId, fieldName, newValue) => {
    try {
      const updateData = { [fieldName]: newValue };
      const updatedUser = await updateUser(userId, updateData);
      setUsers(prev => prev.map(u => u.Id === userId ? updatedUser : u));
      toast.success("User updated successfully!");
    } catch (error) {
      toast.error(error.message);
      throw error; // Re-throw to allow table to handle loading state
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Users</h2>
          <p className="text-gray-400">Manage user accounts and permissions</p>
        </div>
      </div>

      <AdminTable
        data={users}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={loadUsers}
        onDelete={handleDelete}
        onCellEdit={handleCellEdit}
        emptyMessage="No users found"
        emptyIcon="Users"
      />
    </div>
);
};

export default AdminUsersTab;