import postData from "@/services/mockData/posts.json";

let posts = [...postData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data object to simulate the expected API
const data = {
  select: (table) => {
    if (table === "Post") {
      return {
        order: (field, direction) => ({
          list: async () => {
            await delay(200);
            const sorted = [...posts].sort((a, b) => {
              if (direction === "desc") {
                return new Date(b[field]) - new Date(a[field]);
              }
              return new Date(a[field]) - new Date(b[field]);
            });
            return sorted;
          }
        }),
        where: (conditions) => ({
          single: async () => {
            await delay(200);
            const post = posts.find(p => {
              return Object.keys(conditions).every(key => p[key] === conditions[key]);
            });
            if (!post) {
              throw new Error("Post not found");
            }
            return { ...post };
          }
        })
      };
    }
    return null;
  },
  insert: async (table, item) => {
    if (table === "Post") {
      await delay(400);
      const maxId = posts.length > 0 ? Math.max(...posts.map(p => p.Id)) : 0;
      const newPost = {
        ...item,
        Id: maxId + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      posts.push(newPost);
      return { ...newPost };
    }
    return null;
  },
  update: async (table, id, item) => {
    if (table === "Post") {
      await delay(300);
      const index = posts.findIndex(p => p.Id === parseInt(id));
      if (index === -1) {
        throw new Error("Post not found");
      }
      posts[index] = { 
        ...posts[index], 
        ...item, 
        updated_at: new Date().toISOString() 
      };
      return { ...posts[index] };
    }
    return null;
  }
};

export { data };

export const getPosts = async () => data.select("Post").order("created_at", "desc").list();
export const getPostBySlug = async (slug) => data.select("Post").where({ slug }).single();
export const createPost = async (p) => data.insert("Post", p);
export const updatePost = async (id, p) => data.update("Post", id, p);

export const deletePost = async (id) => {
  await delay(300);
  const index = posts.findIndex(p => p.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Post not found");
  }
  const deleted = posts[index];
  posts.splice(index, 1);
  return { ...deleted };
};