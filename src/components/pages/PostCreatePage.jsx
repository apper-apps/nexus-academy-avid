import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { createPost } from '@/services/api/postService';

const PostCreatePage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rich_content: '',
    content_type: 'rich_text',
    thumbnail_url: '',
    summary: ''
  });
  
  const [editorState, setEditorState] = useState({
    showImageInput: false,
    imageUrl: '',
    selectedText: ''
  });

  // Rich text editor functions
  const insertFormatting = (tag, display = null) => {
    const textarea = document.getElementById('rich-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);

    let newText;
    if (tag === 'img') {
      if (editorState.imageUrl) {
        newText = `${beforeText}<img src="${editorState.imageUrl}" alt="${selectedText || 'Image'}" class="w-full max-w-2xl mx-auto rounded-lg my-4" />${afterText}`;
        setEditorState({ ...editorState, showImageInput: false, imageUrl: '' });
      }
    } else if (tag === 'h1' || tag === 'h2' || tag === 'h3') {
      newText = `${beforeText}<${tag} class="font-bold text-white ${tag === 'h1' ? 'text-2xl mb-4' : tag === 'h2' ? 'text-xl mb-3' : 'text-lg mb-2'}">${selectedText || display}</${tag}>${afterText}`;
    } else if (tag === 'ul' || tag === 'ol') {
      const listItem = selectedText || 'List item';
      newText = `${beforeText}<${tag} class="${tag === 'ul' ? 'list-disc' : 'list-decimal'} list-inside ml-4 mb-4"><li>${listItem}</li></${tag}>${afterText}`;
    } else {
      const className = tag === 'strong' ? 'font-bold' : tag === 'em' ? 'italic' : tag === 'u' ? 'underline' : '';
      newText = `${beforeText}<${tag} class="${className}">${selectedText || display}</${tag}>${afterText}`;
    }

    setFormData({ ...formData, rich_content: newText });
    
    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + newText.length - afterText.length;
    }, 0);
  };

  const handleImageInsert = () => {
    if (editorState.imageUrl) {
      insertFormatting('img');
    } else {
      setEditorState({ ...editorState, showImageInput: !editorState.showImageInput });
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('제목을 입력해주세요.');
      return;
    }
    
    if (!formData.rich_content.trim()) {
      toast.error('내용을 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const slug = generateSlug(formData.title);
      const postData = {
        ...formData,
        slug,
        content: formData.rich_content, // For backward compatibility
        author_id: user?.userId || 1
      };

      const result = await createPost(postData);
      toast.success('글이 성공적으로 작성되었습니다!');
      navigate(`/insight/${result.slug || slug}`);
    } catch (error) {
      toast.error('글 작성 중 오류가 발생했습니다.');
      console.error('Post creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-midnight">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/insight')}
            className="inline-flex items-center text-electric hover:text-electric-hover transition-colors font-medium mb-6"
          >
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            인사이트로 돌아가기
          </button>
          
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
            새 글 작성
          </h1>
          <p className="text-gray-400">
            당신의 인사이트를 공유해보세요
          </p>
        </div>

        {/* Post Creation Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              제목 *
            </label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="제목을 입력하세요"
              className="w-full h-12 bg-navy-card border-gray-600 text-white placeholder-gray-400"
              required
            />
          </div>

          {/* Summary Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              요약 (선택사항)
            </label>
            <Input
              type="text"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="글의 간단한 요약을 입력하세요"
              className="w-full h-12 bg-navy-card border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          {/* Thumbnail URL Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              썸네일 이미지 URL (선택사항)
            </label>
            <Input
              type="url"
              value={formData.thumbnail_url}
              onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full h-12 bg-navy-card border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          {/* Rich Text Editor */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300">
              본문 내용 *
            </label>
            
            {/* Editor Toolbar */}
            <div className="flex flex-wrap gap-2 p-3 bg-navy-card rounded-lg border border-gray-600">
              <button
                type="button"
                onClick={() => insertFormatting('strong', '굵은 텍스트')}
                className="flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
              >
                <ApperIcon name="Bold" size={16} />
              </button>
              
              <button
                type="button"
                onClick={() => insertFormatting('em', '기울임 텍스트')}
                className="flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
              >
                <ApperIcon name="Italic" size={16} />
              </button>
              
              <button
                type="button"
                onClick={() => insertFormatting('u', '밑줄 텍스트')}
                className="flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
              >
                <ApperIcon name="Underline" size={16} />
              </button>
              
              <div className="w-px h-6 bg-gray-600 mx-1"></div>
              
              <button
                type="button"
                onClick={() => insertFormatting('h1', '제목 1')}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
              >
                H1
              </button>
              
              <button
                type="button"
                onClick={() => insertFormatting('h2', '제목 2')}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
              >
                H2
              </button>
              
              <button
                type="button"
                onClick={() => insertFormatting('h3', '제목 3')}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
              >
                H3
              </button>
              
              <div className="w-px h-6 bg-gray-600 mx-1"></div>
              
              <button
                type="button"
                onClick={() => insertFormatting('ul')}
                className="flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
              >
                <ApperIcon name="List" size={16} />
              </button>
              
              <button
                type="button"
                onClick={() => insertFormatting('ol')}
                className="flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
              >
                <ApperIcon name="ListOrdered" size={16} />
              </button>
              
              <div className="w-px h-6 bg-gray-600 mx-1"></div>
              
              <button
                type="button"
                onClick={handleImageInsert}
                className="flex items-center px-3 py-1.5 bg-electric hover:bg-electric-hover text-white text-sm rounded transition-colors"
              >
                <ApperIcon name="Image" size={16} className="mr-1" />
                이미지
              </button>
            </div>

            {/* Image URL Input */}
            {editorState.showImageInput && (
              <div className="flex gap-2">
                <Input
                  type="url"
                  value={editorState.imageUrl}
                  onChange={(e) => setEditorState({ ...editorState, imageUrl: e.target.value })}
                  placeholder="이미지 URL을 입력하세요"
                  className="flex-1 h-10 bg-navy-card border-gray-600 text-white placeholder-gray-400"
                />
                <Button
                  type="button"
                  onClick={handleImageInsert}
                  className="px-4 py-2 bg-electric hover:bg-electric-hover text-white rounded"
                >
                  삽입
                </Button>
                <Button
                  type="button"
                  onClick={() => setEditorState({ ...editorState, showImageInput: false, imageUrl: '' })}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded"
                >
                  취소
                </Button>
              </div>
            )}

            {/* Rich Text Editor */}
            <div className="relative">
              <textarea
                id="rich-editor"
                value={formData.rich_content}
                onChange={(e) => setFormData({ ...formData, rich_content: e.target.value })}
                placeholder="여기에 글 내용을 작성하세요. 위의 버튼들을 사용해 텍스트를 꾸밀 수 있습니다..."
                className="w-full h-80 p-4 bg-navy-card border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:border-electric"
                required
              />
            </div>

            {/* Preview */}
            {formData.rich_content && (
              <div className="border border-gray-600 rounded-lg p-4 bg-navy-card">
                <div className="text-sm font-medium text-gray-300 mb-3">미리보기:</div>
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: formData.rich_content }}
                />
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              onClick={() => navigate('/insight')}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-lg transition-colors"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-3 bg-electric hover:bg-electric-hover text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  게시 중...
                </>
              ) : (
                <>
                  <ApperIcon name="Send" size={16} className="mr-2" />
                  글 게시하기
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostCreatePage;