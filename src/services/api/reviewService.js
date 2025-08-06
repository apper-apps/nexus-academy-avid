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

export const getReviews = async () => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "text" } },
        { field: { Name: "likes" } },
        { field: { Name: "featured" } },
        { field: { Name: "created_at" } },
        { 
          field: { Name: "author_id" },
referenceField: { field: { Name: "Name" } }
        },
        { field: { Name: "text" } },
        { field: { Name: "likes" } },
        { field: { Name: "featured" } },
        { field: { Name: "created_at" } }
      ],
      orderBy: [
        { fieldName: "featured", sorttype: "DESC" },
        { fieldName: "created_at", sorttype: "DESC" }
      ]
    };
    
    const response = await apperClient.fetchRecords("review", params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }
    
    // Process the response to ensure proper data formatting
    const processedData = (response.data || []).map(review => ({
      ...review,
      likes: Array.isArray(review.likes) 
        ? review.likes 
        : (review.likes ? review.likes.split(',').filter(Boolean).map(id => parseInt(id)) : [])
    }));
    
    return processedData;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching reviews:", error.response.data.message);
    } else {
      console.error(error.message);
    }
    return [];
  }
};

// New function for toggling likes
export const toggleLike = async (reviewId, userId) => {
  try {
    // First get the current review
    const currentReview = await getReviewById(reviewId);
    
    let currentLikes = [];
    if (Array.isArray(currentReview.likes)) {
      currentLikes = currentReview.likes;
    } else if (currentReview.likes) {
      currentLikes = currentReview.likes.split(',').filter(Boolean).map(id => parseInt(id));
    }
    
    const userIdInt = parseInt(userId);
    let newLikes;
    
    if (currentLikes.includes(userIdInt)) {
      // Remove like
      newLikes = currentLikes.filter(id => id !== userIdInt);
    } else {
      // Add like
      newLikes = [...currentLikes, userIdInt];
    }
    
    // Convert back to comma-separated string for database
    const likesString = newLikes.length > 0 ? newLikes.join(',') : '';
    
    await updateReview(reviewId, { likes: likesString });
    
    return newLikes;
return newLikes;
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
};

export const getFeaturedReviews = async () => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "text" } },
        { field: { Name: "likes" } },
        { field: { Name: "featured" } },
        { field: { Name: "created_at" } },
        { 
          field: { Name: "author_id" },
          referenceField: { field: { Name: "Name" } }
        }
      ],
      where: [
        {
          FieldName: "featured",
          Operator: "EqualTo",
          Values: [true]
        }
      ]
    };
    
    const response = await apperClient.fetchRecords("review", params);
    
    if (!response.success) {
      console.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching featured reviews:", error.response.data.message);
    } else {
      console.error(error.message);
    }
    return [];
  }
};

export const getReviewById = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "text" } },
        { field: { Name: "likes" } },
        { field: { Name: "featured" } },
        { field: { Name: "created_at" } },
        { 
          field: { Name: "author_id" },
          referenceField: { field: { Name: "Name" } }
        }
      ]
    };
    
    const response = await apperClient.getRecordById("review", parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching review with ID ${id}:`, error.response.data.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const createReview = async (reviewData) => {
  try {
    const apperClient = getApperClient();
    const params = {
      records: [{
        Name: reviewData.Name || `Review by User ${reviewData.author_id}`,
        text: reviewData.text,
        likes: "", // Start with empty string
        featured: reviewData.featured || false,
        created_at: new Date().toISOString(),
        author_id: parseInt(reviewData.author_id)
      }]
    };
    
    const response = await apperClient.createRecord("review", params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to create reviews ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        failedRecords.forEach(record => {
          if (record.message) toast.error(record.message);
        });
        throw new Error("Failed to create review");
      }
      return response.results[0].data;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating review:", error.response.data.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const updateReview = async (id, reviewData) => {
  try {
    const apperClient = getApperClient();
    const updateData = {
      Id: parseInt(id)
    };
    
    // Only include updateable fields
    if (reviewData.Name !== undefined) {
      updateData.Name = reviewData.Name;
    }
    if (reviewData.text !== undefined) {
      updateData.text = reviewData.text;
    }
    if (reviewData.likes !== undefined) {
      // Ensure likes is stored as comma-separated string
      updateData.likes = Array.isArray(reviewData.likes) 
        ? reviewData.likes.join(',')
        : reviewData.likes || '';
    }
    if (reviewData.featured !== undefined) {
      updateData.featured = reviewData.featured;
    }
    if (reviewData.author_id !== undefined) {
      updateData.author_id = parseInt(reviewData.author_id);
    }
    
    const params = {
      records: [updateData]
    };
    
    const response = await apperClient.updateRecord("review", params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to update reviews ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        failedRecords.forEach(record => {
          if (record.message) toast.error(record.message);
        });
        throw new Error("Failed to update review");
      }
      return response.results[0].data;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating review:", error.response.data.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};


export const deleteReview = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord("review", params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to delete reviews ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        failedRecords.forEach(record => {
          if (record.message) toast.error(record.message);
        });
        throw new Error("Failed to delete review");
      }
      return response.results[0].data;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting review:", error.response.data.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};