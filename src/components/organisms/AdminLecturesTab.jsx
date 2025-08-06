import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import AdminTable from '@/components/organisms/AdminTable';
import FormField from '@/components/molecules/FormField';
import { getLectures, createLecture, updateLecture, deleteLecture } from '@/services/api/lectureService';
import { getPrograms } from '@/services/api/programService';

const AdminLecturesTab = () => {
  const [lectures, setLectures] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner",
    duration: "",
    video_url: "",
    program_id: ""
  });

  const columns = [
    { field: "title", header: "Title", sortable: true },
    { field: "category", header: "Category", type: "badge", sortable: true },
    { field: "level", header: "Level", type: "badge", badgeVariant: "success", sortable: true },
    { 
      field: "duration", 
      header: "Duration", 
      sortable: true,
      render: (value) => {
        const minutes = Math.floor(value / 60);
        return `${minutes}m`;
      }
    },
    { 
      field: "program_id", 
      header: "Program", 
      render: (value) => {
        const program = programs.find(p => p.Id === value);
        return program ? program.title : 'Unknown';
      }
    },
    { field: "created_at", header: "Created", type: "date", sortable: true }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [lectureData, programData] = await Promise.all([
        getLectures(),
        getPrograms()
      ]);
      setLectures(lectureData);
      setPrograms(programData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      level: "beginner",
      duration: "",
      video_url: "",
      program_id: ""
    });
    setEditingLecture(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (lecture) => {
    setFormData({
      title: lecture.title,
      description: lecture.description,
      category: lecture.category,
      level: lecture.level,
      duration: lecture.duration.toString(),
      video_url: lecture.video_url,
      program_id: lecture.program_id.toString()
    });
    setEditingLecture(lecture);
    setIsModalOpen(true);
  };

  const handleDelete = async (lecture) => {
    if (!confirm(`Are you sure you want to delete lecture "${lecture.title}"?`)) return;
    
    try {
      await deleteLecture(lecture.Id);
      setLectures(prev => prev.filter(l => l.Id !== lecture.Id));
      toast.success("Lecture deleted successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      duration: parseInt(formData.duration),
      program_id: parseInt(formData.program_id)
    };
    
    try {
      if (editingLecture) {
        const updatedLecture = await updateLecture(editingLecture.Id, submitData);
        setLectures(prev => prev.map(l => l.Id === editingLecture.Id ? updatedLecture : l));
        toast.success("Lecture updated successfully!");
      } else {
        const newLecture = await createLecture(submitData);
        setLectures(prev => [newLecture, ...prev]);
        toast.success("Lecture created successfully!");
      }
      
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Lectures</h2>
          <p className="text-gray-400">Manage lecture content and organization</p>
        </div>
        <Button onClick={handleCreate}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Lecture
        </Button>
      </div>

      <AdminTable
        data={lectures}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={loadData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No lectures found"
        emptyIcon="Play"
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-navy-card rounded-xl p-6 w-full max-w-2xl border border-electric/20 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                {editingLecture ? 'Edit Lecture' : 'Create Lecture'}
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
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-navy-card border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-electric focus:border-electric"
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Mindset, Business"
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Level
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-navy-card border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-electric focus:border-electric"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="master_common">Master Common</option>
                  </select>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  label="Duration (seconds)"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="3600"
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Program
                  </label>
                  <select
                    name="program_id"
                    value={formData.program_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-navy-card border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-electric focus:border-electric"
                    required
                  >
                    <option value="">Select a program</option>
                    {programs.map((program) => (
                      <option key={program.Id} value={program.Id}>
                        {program.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <FormField
                label="Video URL"
                name="video_url"
                value={formData.video_url}
                onChange={handleInputChange}
                placeholder="https://example.com/video"
                required
              />

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
                  {editingLecture ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLecturesTab;