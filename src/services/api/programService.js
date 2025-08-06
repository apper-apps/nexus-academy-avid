import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const getPrograms = async () => {
  try {
    const apperClient = getApperClient();
    const params = {
fields: [
        { field: { Name: "Id" } },
        { field: { Name: "Name" } },
        { field: { Name: "slug" } },
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "thumbnail_url" } },
        { field: { Name: "description_short" } },
        { field: { Name: "description_long" } },
        { field: { Name: "price" } },
        { field: { Name: "has_common_course" } },
        { field: { Name: "type" } },
        { field: { Name: "created_at" } }
      ]
    };
    
    const response = await apperClient.fetchRecords("program", params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching programs:", error.response.data.message);
    } else {
      console.error(error.message);
    }
    return [];
  }
};

export const getProgramById = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = {
fields: [
        { field: { Name: "Id" } },
        { field: { Name: "Name" } },
        { field: { Name: "slug" } },
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "thumbnail_url" } },
        { field: { Name: "description_short" } },
        { field: { Name: "description_long" } },
        { field: { Name: "price" } },
        { field: { Name: "has_common_course" } },
        { field: { Name: "type" } },
        { field: { Name: "created_at" } }
      ]
    };
    
const response = await apperClient.getRecordById("program", parseInt(id), params);
    
    if (!response.success) {
      const errorMessage = response.message || `Program with ID ${id} not found`;
      console.error(`Error fetching program with ID ${id}:`, errorMessage);
      throw new Error(errorMessage);
    }
    
    if (!response.data) {
      const errorMessage = `Program record with ID ${id} does not exist`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching program with ID ${id}:`, error.response.data.message);
      throw new Error(`Failed to fetch program: ${error.response.data.message}`);
    } else {
      console.error(`Error fetching program with ID ${id}:`, error.message);
      throw new Error(error.message || `Program with ID ${id} not found`);
    }
  }
};

export const getProgramBySlug = async (slug) => {
  try {
    const apperClient = getApperClient();
    const params = {
fields: [
        { field: { Name: "Id" } },
        { field: { Name: "Name" } },
        { field: { Name: "slug" } },
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "thumbnail_url" } },
        { field: { Name: "description_short" } },
        { field: { Name: "description_long" } },
        { field: { Name: "price" } },
        { field: { Name: "has_common_course" } },
        { field: { Name: "type" } },
        { field: { Name: "created_at" } }
      ],
      where: [
        {
          FieldName: "slug",
          Operator: "EqualTo",
          Values: [slug]
        }
      ]
    };
    
    const response = await apperClient.fetchRecords("program", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (!response.data || response.data.length === 0) {
      throw new Error("Program not found");
    }
    
    return response.data[0];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching program by slug ${slug}:`, error.response.data.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const createProgram = async (programData) => {
  try {
    const apperClient = getApperClient();
    const params = {
      records: [{
        Name: programData.title,
        slug: programData.slug,
        title: programData.title,
        description: programData.description,
        thumbnail_url: programData.thumbnail_url || "",
        description_short: programData.description_short || "",
        description_long: programData.description_long || "",
        price: parseFloat(programData.price),
        has_common_course: programData.has_common_course || false,
        type: programData.type,
        created_at: new Date().toISOString()
      }]
    };
    
    const response = await apperClient.createRecord("program", params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to create programs ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        failedRecords.forEach(record => {
          if (record.message) toast.error(record.message);
        });
        throw new Error("Failed to create program");
      }
      toast.success(`Program "${programData.title}" created successfully!`);
      return response.results[0].data;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating program:", error.response.data.message);
    } else {
      console.error(error.message);
    }
    toast.error("Failed to create program. Please try again.");
    throw error;
  }
};

export const updateProgram = async (id, programData) => {
  try {
    const apperClient = getApperClient();
    const updateData = {
      Id: parseInt(id)
    };
    
    // Only include updateable fields
    if (programData.Name !== undefined) {
      updateData.Name = programData.Name;
    }
    if (programData.slug !== undefined) {
      updateData.slug = programData.slug;
    }
    if (programData.title !== undefined) {
      updateData.title = programData.title;
      updateData.Name = programData.title; // Update Name field as well
    }
    if (programData.description !== undefined) {
      updateData.description = programData.description;
    }
    if (programData.price !== undefined) {
      updateData.price = parseFloat(programData.price);
    }
    if (programData.has_common_course !== undefined) {
      updateData.has_common_course = programData.has_common_course;
    }
    if (programData.type !== undefined) {
      updateData.type = programData.type;
    }
    
    const params = {
      records: [updateData]
    };
    
    const response = await apperClient.updateRecord("program", params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to update programs ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        failedRecords.forEach(record => {
          if (record.message) toast.error(record.message);
        });
        throw new Error("Failed to update program");
      }
      return response.results[0].data;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating program:", error.response.data.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const deleteProgram = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord("program", params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to delete programs ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        failedRecords.forEach(record => {
          if (record.message) toast.error(record.message);
        });
        throw new Error("Failed to delete program");
      }
      return response.results[0].data;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting program:", error.response.data.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const getNonMembershipPrograms = async () => {
  try {
    const apperClient = getApperClient();
    const params = {
fields: [
        { field: { Name: "Id" } },
        { field: { Name: "Name" } },
        { field: { Name: "slug" } },
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "thumbnail_url" } },
        { field: { Name: "description_short" } },
        { field: { Name: "description_long" } },
        { field: { Name: "price" } },
        { field: { Name: "has_common_course" } },
        { field: { Name: "type" } },
        { field: { Name: "created_at" } }
      ],
      where: [
        {
          FieldName: "slug",
          Operator: "NotEqualTo",
          Values: ["membership"]
        }
      ]
    };
    
    const response = await apperClient.fetchRecords("program", params);
    
    if (!response.success) {
      console.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching non-membership programs:", error.response.data.message);
    } else {
      console.error(error.message);
    }
    return [];
  }
};