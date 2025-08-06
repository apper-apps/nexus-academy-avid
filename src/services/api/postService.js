import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const getPosts = async () => {
  try {
    const apperClient = getApperClient();
    const params = {
fields: [
        { field: { Name: "Name" } },
        { field: { Name: "slug" } },
        { field: { Name: "title" } },
        { field: { Name: "content" } },
        { field: { Name: "thumbnail_url" } },
        { field: { Name: "summary" } },
        { field: { Name: "created_at" } },
        { field: { Name: "updated_at" } },
        { 
          field: { Name: "author_id" },
          referenceField: { field: { Name: "Name" } }
        }
      ],
      orderBy: [
        { fieldName: "created_at", sorttype: "DESC" }
      ]
    };
    
    const response = await apperClient.fetchRecords("post", params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching posts:", error.response.data.message);
    } else {
      console.error(error.message);
    }
    return [];
  }
};

export const getPostBySlug = async (slug) => {
  try {
    const apperClient = getApperClient();
const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "slug" } },
        { field: { Name: "title" } },
        { field: { Name: "content" } },
        { field: { Name: "summary" } },
        { field: { Name: "thumbnail_url" } },
        {
          field: { Name: "author_id" },
          referenceField: { field: { Name: "Name" } }
        },
        { field: { Name: "created_at" } },
        { field: { Name: "updated_at" } }
      ],
      where: [
        {
          FieldName: "slug",
          Operator: "EqualTo",
          Values: [slug]
        }
      ]
    };
    
    const response = await apperClient.fetchRecords("post", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (!response.data || response.data.length === 0) {
      throw new Error("Post not found");
    }
    
    return response.data[0];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching post by slug ${slug}:`, error.response.data.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const createPost = async (postData) => {
  try {
    const apperClient = getApperClient();
    const params = {
      records: [{
Name: postData.title,
        slug: postData.slug,
        title: postData.title,
        content: postData.content,
        content_type: postData.content_type || "text",
        rich_content: postData.rich_content || "",
        thumbnail_url: postData.thumbnail_url || "",
        summary: postData.summary || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author_id: parseInt(postData.author_id || 1)
      }]
    };
    
    const response = await apperClient.createRecord("post", params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to create posts ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        failedRecords.forEach(record => {
          if (record.message) toast.error(record.message);
        });
        throw new Error("Failed to create post");
      }
      return response.results[0].data;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating post:", error.response.data.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const updatePost = async (id, postData) => {
  try {
    const apperClient = getApperClient();
    const updateData = {
      Id: parseInt(id),
      updated_at: new Date().toISOString()
    };
    
    // Only include updateable fields
if (postData.Name !== undefined) {
      updateData.Name = postData.Name;
    }
    if (postData.slug !== undefined) {
      updateData.slug = postData.slug;
    }
    if (postData.title !== undefined) {
      updateData.title = postData.title;
      updateData.Name = postData.title; // Update Name field as well
    }
    if (postData.content !== undefined) {
      updateData.content = postData.content;
    }
    if (postData.thumbnail_url !== undefined) {
      updateData.thumbnail_url = postData.thumbnail_url;
    }
    if (postData.summary !== undefined) {
      updateData.summary = postData.summary;
    }
    if (postData.author_id !== undefined) {
      updateData.author_id = parseInt(postData.author_id);
    }
    
    const params = {
      records: [updateData]
    };
    
    const response = await apperClient.updateRecord("post", params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to update posts ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        failedRecords.forEach(record => {
          if (record.message) toast.error(record.message);
        });
        throw new Error("Failed to update post");
      }
      return response.results[0].data;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating post:", error.response.data.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const deletePost = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord("post", params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to delete posts ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        failedRecords.forEach(record => {
          if (record.message) toast.error(record.message);
        });
        throw new Error("Failed to delete post");
      }
      return response.results[0].data;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting post:", error.response.data.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

// Legacy exports for compatibility
const data = {
  select: (table) => {
    if (table === "Post") {
      return {
        order: (field, direction) => ({
          list: getPosts
        }),
        where: (conditions) => ({
          single: async () => {
            if (conditions.slug) {
              return await getPostBySlug(conditions.slug);
            }
            throw new Error("Post not found");
          }
        })
      };
    }
    return null;
  },
  insert: createPost,
  update: updatePost
};

export { data };