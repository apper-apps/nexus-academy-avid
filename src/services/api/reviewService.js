import { toast } from 'react-toastify';

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
        }
      ],
      orderBy: [
        { fieldName: "created_at", sorttype: "DESC" }
      ]
    };
    
    const response = await apperClient.fetchRecords("review", params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching reviews:", error.response.data.message);
    } else {
      console.error(error.message);
    }
    return [];
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
        Name: reviewData.Name || `Review by ${reviewData.author_id}`,
        text: reviewData.text,
        likes: reviewData.likes || "",
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
      updateData.likes = reviewData.likes;
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

export const toggleLike = async (id, userId) => {
  try {
    // First, get the current review to check current likes
    const currentReview = await getReviewById(id);
    const currentLikes = currentReview.likes ? currentReview.likes.split(',').filter(l => l) : [];
    const userIdStr = userId.toString();
    
    let updatedLikes;
    if (currentLikes.includes(userIdStr)) {
      // Remove like
      updatedLikes = currentLikes.filter(like => like !== userIdStr);
    } else {
      // Add like
      updatedLikes = [...currentLikes, userIdStr];
    }
    
    const updatedReview = await updateReview(id, {
      likes: updatedLikes.join(',')
    });
    
    return updatedReview;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error toggling like:", error.response.data.message);
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