/**
 * Permission Service - Handles all permission-related database operations
 * Manages role-based page access permissions with granular control
 * Note: roleId is now a Picklist field with values: free, member, master, both
 */

class PermissionService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'permission';
    this.validRoles = ['free', 'member', 'master', 'both'];
  }

  /**
   * Get all permissions with optional filtering and pagination
   */
  async getAll(filters = {}) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "pageId" } }, // Lookup field - returns {Id, Name}
          { field: { Name: "roleId" } }, // Now Picklist field
          { field: { Name: "canView" } },
          { field: { Name: "canEdit" } },
          { field: { Name: "canDelete" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        orderBy: [
          {
            fieldName: "Name",
            sorttype: "ASC"
          }
        ],
        pagingInfo: {
          limit: filters.limit || 50,
          offset: filters.offset || 0
        }
      };

      // Add role-based filtering
      if (filters.role && this.validRoles.includes(filters.role)) {
        params.where = [
          {
            FieldName: "roleId",
            Operator: "EqualTo",
            Values: [filters.role]
          }
        ];
      }

      // Add page-based filtering
      if (filters.pageId) {
        const pageFilter = {
          FieldName: "pageId",
          Operator: "EqualTo",
          Values: [parseInt(filters.pageId)]
        };
        
        if (params.where) {
          params.where.push(pageFilter);
        } else {
          params.where = [pageFilter];
        }
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching permissions:", error.response.data.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  /**
   * Get permissions by role
   */
  async getByRole(role) {
    try {
      if (!this.validRoles.includes(role)) {
        console.error(`Invalid role: ${role}. Valid roles are: ${this.validRoles.join(', ')}`);
        return [];
      }

      return await this.getAll({ role });
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching permissions for role ${role}:`, error.response.data.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  /**
   * Get a specific permission by ID
   */
  async getById(permissionId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "pageId" } },
          { field: { Name: "roleId" } },
          { field: { Name: "canView" } },
          { field: { Name: "canEdit" } },
          { field: { Name: "canDelete" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, permissionId, params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching permission with ID ${permissionId}:`, error.response.data.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  /**
   * Create new permission records
   */
  async create(permissions) {
    try {
      // Ensure permissions is an array
      const permissionArray = Array.isArray(permissions) ? permissions : [permissions];
      
      const params = {
        records: permissionArray.map(permission => ({
          // Only include Updateable fields
          Name: permission.Name,
          Tags: permission.Tags || "",
          pageId: parseInt(permission.pageId), // Lookup field - send ID as integer
          roleId: permission.roleId, // Picklist field - send as string
          canView: permission.canView || false,
          canEdit: permission.canEdit || false,
          canDelete: permission.canDelete || false
        }))
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create permissions ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }

        return successfulRecords.map(result => result.data);
      }

      return [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating permissions:", error.response.data.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  /**
   * Update existing permission records
   */
  async update(updates) {
    try {
      // Ensure updates is an array
      const updateArray = Array.isArray(updates) ? updates : [updates];
      
      const params = {
        records: updateArray.map(update => ({
          Id: update.Id,
          // Only include Updateable fields
          Name: update.Name,
          Tags: update.Tags,
          pageId: parseInt(update.pageId),
          roleId: update.roleId,
          canView: update.canView,
          canEdit: update.canEdit,
          canDelete: update.canDelete
        }))
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update permissions ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }

        return successfulUpdates.map(result => result.data);
      }

      return [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating permissions:", error.response.data.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  /**
   * Delete permission records by IDs
   */
  async delete(recordIds) {
    try {
      const params = {
        RecordIds: Array.isArray(recordIds) ? recordIds : [recordIds]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete permissions ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        }

        return failedDeletions.length === 0;
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting permissions:", error.response.data.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}

export default new PermissionService();