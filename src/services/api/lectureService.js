import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const getLectures = async () => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "category" } },
        { field: { Name: "level" } },
        { field: { Name: "duration" } },
        { field: { Name: "video_url" } },
        { field: { Name: "embed_url" } },
        { field: { Name: "created_at" } },
        { 
          field: { Name: "program_id" },
          referenceField: { field: { Name: "Name" } }
        }
      ]
    };
    
    const response = await apperClient.fetchRecords("lecture", params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching lectures:", error.response.data.message);
    } else {
      console.error(error.message);
    }
    return [];
  }
};

export const getLectureById = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "category" } },
        { field: { Name: "level" } },
        { field: { Name: "duration" } },
        { field: { Name: "video_url" } },
        { field: { Name: "embed_url" } },
        { field: { Name: "created_at" } },
        { 
          field: { Name: "program_id" },
          referenceField: { field: { Name: "Name" } }
        }
      ]
    };
    
    const response = await apperClient.getRecordById("lecture", parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching lecture with ID ${id}:`, error.response.data.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const getLecturesByProgram = async (programId) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "category" } },
        { field: { Name: "level" } },
        { field: { Name: "duration" } },
        { field: { Name: "video_url" } },
        { field: { Name: "embed_url" } },
        { field: { Name: "created_at" } }
      ],
      where: [
        {
          FieldName: "program_id",
          Operator: "EqualTo",
          Values: [parseInt(programId)]
        }
      ]
    };
    
    const response = await apperClient.fetchRecords("lecture", params);
    
    if (!response.success) {
      console.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching lectures for program ${programId}:`, error.response.data.message);
    } else {
      console.error(error.message);
    }
    return [];
  }
};

export const getLecturesByCategory = async (category) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "category" } },
        { field: { Name: "level" } },
        { field: { Name: "duration" } },
        { field: { Name: "video_url" } },
        { field: { Name: "embed_url" } },
        { field: { Name: "created_at" } }
      ],
      where: [
        {
          FieldName: "category",
          Operator: "EqualTo",
          Values: [category]
        }
      ]
    };
    
    const response = await apperClient.fetchRecords("lecture", params);
    
    if (!response.success) {
      console.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching lectures for category ${category}:`, error.response.data.message);
    } else {
      console.error(error.message);
    }
    return [];
  }
};

export const createLecture = async (lectureData) => {
  try {
    const apperClient = getApperClient();
    const params = {
      records: [{
        Name: lectureData.title,
        title: lectureData.title,
        description: lectureData.description,
        category: lectureData.category,
        level: lectureData.level,
        duration: parseInt(lectureData.duration),
        video_url: lectureData.video_url,
        embed_url: lectureData.embed_url || lectureData.video_url,
        created_at: new Date().toISOString(),
        program_id: parseInt(lectureData.program_id)
      }]
    };
    
    const response = await apperClient.createRecord("lecture", params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to create lectures ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        failedRecords.forEach(record => {
          if (record.message) toast.error(record.message);
        });
        throw new Error("Failed to create lecture");
      }
      return response.results[0].data;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating lecture:", error.response.data.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const updateLecture = async (id, lectureData) => {
  try {
    const apperClient = getApperClient();
    const updateData = {
      Id: parseInt(id)
    };
    
    // Only include updateable fields
    if (lectureData.Name !== undefined) {
      updateData.Name = lectureData.Name;
    }
    if (lectureData.title !== undefined) {
      updateData.title = lectureData.title;
      updateData.Name = lectureData.title; // Update Name field as well
    }
    if (lectureData.description !== undefined) {
      updateData.description = lectureData.description;
    }
    if (lectureData.category !== undefined) {
      updateData.category = lectureData.category;
    }
    if (lectureData.level !== undefined) {
      updateData.level = lectureData.level;
    }
    if (lectureData.duration !== undefined) {
      updateData.duration = parseInt(lectureData.duration);
    }
    if (lectureData.video_url !== undefined) {
      updateData.video_url = lectureData.video_url;
    }
    if (lectureData.embed_url !== undefined) {
      updateData.embed_url = lectureData.embed_url;
    }
    if (lectureData.program_id !== undefined) {
      updateData.program_id = parseInt(lectureData.program_id);
    }
    
    const params = {
      records: [updateData]
    };
    
    const response = await apperClient.updateRecord("lecture", params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to update lectures ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        failedRecords.forEach(record => {
          if (record.message) toast.error(record.message);
        });
        throw new Error("Failed to update lecture");
      }
      return response.results[0].data;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating lecture:", error.response.data.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const deleteLecture = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord("lecture", params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to delete lectures ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        failedRecords.forEach(record => {
          if (record.message) toast.error(record.message);
        });
        throw new Error("Failed to delete lecture");
      }
      return response.results[0].data;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting lecture:", error.response.data.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};