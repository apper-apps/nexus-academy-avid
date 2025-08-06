import { toast } from "react-toastify";
import React from "react";
import { data } from "@/services/api/postService";
import Error from "@/components/ui/Error";

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const getUsers = async () => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "email" } },
        { field: { Name: "role" } },
        { field: { Name: "master_cohort" } },
        { field: { Name: "is_admin" } },
        { field: { Name: "created_at" } }
      ],
      orderBy: [
        { fieldName: "created_at", sorttype: "DESC" }
      ]
    };
    
    const response = await apperClient.fetchRecords("app_User", params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching users:", error.response.data.message);
    } else {
      console.error(error.message);
    }
    return [];
  }
};

export const getUserById = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "email" } },
        { field: { Name: "role" } },
        { field: { Name: "master_cohort" } },
        { field: { Name: "is_admin" } },
        { field: { Name: "created_at" } }
      ]
    };
    
const response = await apperClient.getRecordById("app_User", parseInt(id), params);
    
    if (!response.success) {
      const errorMessage = response.message || `User with ID ${id} not found`;
      console.error(`Error fetching user with ID ${id}:`, errorMessage);
      throw new Error(errorMessage);
    }
    
    if (!response.data) {
      const errorMessage = `User record with ID ${id} does not exist`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching user with ID ${id}:`, error.response.data.message);
      throw new Error(`Failed to fetch user: ${error.response.data.message}`);
    } else {
      console.error(`Error fetching user with ID ${id}:`, error.message);
      throw new Error(error.message || `User with ID ${id} not found`);
    }
};

export const createUser = async (userData) => {
  try {
    const apperClient = getApperClient();
    const params = {
      records: [{
        Name: userData.Name || userData.name,
        email: userData.email,
        role: userData.role || "free",
        master_cohort: userData.master_cohort || null,
        is_admin: userData.is_admin || false,
        created_at: new Date().toISOString()
      }]
    };
    
    const response = await apperClient.createRecord("app_User", params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to create users ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        failedRecords.forEach(record => {
          if (record.message) toast.error(record.message);
        });
        throw new Error("Failed to create user");
      }
      return response.results[0].data;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating user:", error.response.data.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const apperClient = getApperClient();
    const updateData = {
      Id: parseInt(id)
    };
    
    // Only include updateable fields
    if (userData.Name !== undefined || userData.name !== undefined) {
      updateData.Name = userData.Name || userData.name;
    }
    if (userData.email !== undefined) {
      updateData.email = userData.email;
    }
    if (userData.role !== undefined) {
      updateData.role = userData.role;
    }
    if (userData.master_cohort !== undefined) {
      updateData.master_cohort = userData.master_cohort;
    }
    if (userData.is_admin !== undefined) {
      updateData.is_admin = userData.is_admin;
    }
    
    const params = {
      records: [updateData]
    };
    
    const response = await apperClient.updateRecord("app_User", params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to update users ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        failedRecords.forEach(record => {
          if (record.message) toast.error(record.message);
        });
        throw new Error("Failed to update user");
      }
      return response.results[0].data;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating user:", error.response.data.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord("app_User", params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      if (failedRecords.length > 0) {
        console.error(`Failed to delete users ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        failedRecords.forEach(record => {
          if (record.message) toast.error(record.message);
        });
        throw new Error("Failed to delete user");
}
      return response.results[0].data;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting user:", error.response.data.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};