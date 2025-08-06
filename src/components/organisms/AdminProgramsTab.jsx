import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import AdminTable from '@/components/organisms/AdminTable';
import FormField from '@/components/molecules/FormField';
import { getPrograms, createProgram, updateProgram, deleteProgram } from '@/services/api/programService';

const AdminProgramsTab = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    thumbnail_url: "",
    description_short: "",
    description_long: "",
    price: "",
    type: "member",
    has_common_course: false
  });

  const columns = [
    { field: "title", header: "Title", sortable: true },
    { field: "slug", header: "Slug", sortable: true },
    { field: "price", header: "Price", type: "currency", sortable: true },
    { 
      field: "type", 
      header: "Type", 
      type: "badge",
      badgeVariant: "primary",
      sortable: true 
    },
    { field: "has_common_course", header: "Common Course", type: "boolean", sortable: true },
    { field: "created_at", header: "Created", type: "date", sortable: true }
  ];

  const loadPrograms = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPrograms();
      setPrograms(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, []);

const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      thumbnail_url: "",
      description_short: "",
      description_long: "",
      price: "",
      type: "member",
      has_common_course: false
    });
    setEditingProgram(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

const handleEdit = (program) => {
    setFormData({
      title: program.title,
      slug: program.slug,
      description: program.description,
      thumbnail_url: program.thumbnail_url || "",
      description_short: program.description_short || "",
      description_long: program.description_long || "",
      price: program.price.toString(),
      type: program.type,
      has_common_course: program.has_common_course
    });
    setEditingProgram(program);
    setIsModalOpen(true);
  };

  const handleDelete = async (program) => {
    if (!confirm(`Are you sure you want to delete program "${program.title}"?`)) return;
    
    try {
      await deleteProgram(program.Id);
      setPrograms(prev => prev.filter(p => p.Id !== program.Id));
      toast.success("Program deleted successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      price: parseFloat(formData.price)
    };
    
    try {
      if (editingProgram) {
        const updatedProgram = await updateProgram(editingProgram.Id, submitData);
        setPrograms(prev => prev.map(p => p.Id === editingProgram.Id ? updatedProgram : p));
        toast.success("Program updated successfully!");
      } else {
        const newProgram = await createProgram(submitData);
        setPrograms(prev => [newProgram, ...prev]);
        toast.success("Program created successfully!");
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
          <h2 className="text-xl font-semibold text-white">Programs</h2>
          <p className="text-gray-400">Manage learning programs and courses</p>
        </div>
        <Button onClick={handleCreate}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Program
        </Button>
      </div>

      <AdminTable
        data={programs}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={loadPrograms}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No programs found"
        emptyIcon="BookOpen"
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-navy-card rounded-xl p-6 w-full max-w-2xl border border-electric/20 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                {editingProgram ? 'Edit Program' : 'Create Program'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
                
                <FormField
                  label="Slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="url-friendly-name"
                  required
                />
              </div>
<FormField
                label="Thumbnail URL"
                name="thumbnail_url"
                value={formData.thumbnail_url}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Short Description
                </label>
                <textarea
                  name="description_short"
                  value={formData.description_short}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-navy-card border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-electric focus:border-electric"
                  placeholder="Brief program summary..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Long Description
                </label>
                <textarea
                  name="description_long"
                  value={formData.description_long}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-navy-card border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-electric focus:border-electric"
                  placeholder="Detailed program information..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Description (Legacy)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-navy-card border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-electric focus:border-electric"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="997"
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-navy-card border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-electric focus:border-electric"
                  >
                    <option value="member">Member</option>
                    <option value="master">Master</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="has_common_course"
                  name="has_common_course"
                  checked={formData.has_common_course}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="has_common_course" className="text-sm text-gray-200">
                  Has common course
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
                  {editingProgram ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProgramsTab;