import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import AdminTable from '@/components/organisms/AdminTable';
import FormField from '@/components/molecules/FormField';
import { getPosts, createPost, updatePost, deletePost } from '@/services/api/postService';

const AdminPostsTab = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    thumbnail_url: "",
    summary: "",
    author_id: 1
  });

  const columns = [
    { field: "title", header: "Title", sortable: true },
    { field: "slug", header: "Slug", sortable: true },
    { 
      field: "content", 
      header: "Content", 
      render: (value) => value.length > 100 ? value.substring(0, 100) + '...' : value
    },
    { field: "created_at", header: "Created", type: "date", sortable: true },
    { field: "updated_at", header: "Updated", type: "date", sortable: true }
  ];

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      thumbnail_url: "",
      summary: "",
      author_id: 1
    });
    setEditingPost(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

const handleEdit = (post) => {
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      thumbnail_url: post.thumbnail_url || "",
      summary: post.summary || "",
      author_id: post.author_id
    });
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleDelete = async (post) => {
    if (!confirm(`Are you sure you want to delete post "${post.title}"?`)) return;
    
    try {
      await deletePost(post.Id);
      setPosts(prev => prev.filter(p => p.Id !== post.Id));
      toast.success("Post deleted successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingPost) {
        const updatedPost = await updatePost(editingPost.Id, formData);
        setPosts(prev => prev.map(p => p.Id === editingPost.Id ? updatedPost : p));
        toast.success("Post updated successfully!");
      } else {
        const newPost = await createPost(formData);
        setPosts(prev => [newPost, ...prev]);
        toast.success("Post created successfully!");
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
          <h2 className="text-xl font-semibold text-white">Posts</h2>
          <p className="text-gray-400">Manage blog posts and insights content</p>
        </div>
        <Button onClick={handleCreate}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Post
        </Button>
      </div>

      <AdminTable
        data={posts}
        columns={columns}
        loading={loading}
        error={error}
        onRetry={loadPosts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No posts found"
        emptyIcon="FileText"
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-navy-card rounded-xl p-6 w-full max-w-4xl border border-electric/20 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                {editingPost ? 'Edit Post' : 'Create Post'}
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
                  label="Title (제목)"
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
                  placeholder="url-friendly-title"
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  label="Thumbnail URL (썸네일 URL)"
                  name="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
                
                <FormField
                  label="SEO Summary (SEO 요약 160자)"
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  placeholder="Brief description for SEO (max 160 characters)"
                  maxLength={160}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={12}
                  className="w-full px-4 py-2.5 bg-navy-card border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-electric focus:border-electric"
                  placeholder="Write your post content here..."
                  required
                />
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
                  {editingPost ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPostsTab;