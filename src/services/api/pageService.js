/**
 * Page Service - Handles all page-related database operations
 * Manages page records with full CRUD operations
 */

class PageService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'page';
  }

  /**
   * Get all pages with optional filtering and pagination
   */
  async getAll(filters = {}) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "url" } },
          { field: { Name: "description" } },
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

      // Add filtering if provided
      if (filters.search) {
        params.where = [
          {
            FieldName: "Name",
            Operator: "Contains",
            Values: [filters.search]
          }
        ];
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching pages:", error.response.data.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  /**
   * Get a specific page by ID
   */
  async getById(pageId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "url" } },
          { field: { Name: "description" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, pageId, params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching page with ID ${pageId}:`, error.response.data.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  /**
   * Create new page records
   */
  async create(pages) {
    try {
      // Ensure pages is an array
      const pageArray = Array.isArray(pages) ? pages : [pages];
      
      const params = {
        records: pageArray.map(page => ({
          // Only include Updateable fields
          Name: page.Name,
          Tags: page.Tags || "",
          url: page.url,
          description: page.description || ""
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
          console.error(`Failed to create pages ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }

        return successfulRecords.map(result => result.data);
      }

      return [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating pages:", error.response.data.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  /**
   * Update existing page records
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
          url: update.url,
          description: update.description
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
          console.error(`Failed to update pages ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }

        return successfulUpdates.map(result => result.data);
      }

      return [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating pages:", error.response.data.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  /**
   * Delete page records by IDs
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
          console.error(`Failed to delete pages ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        }

        return failedDeletions.length === 0;
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting pages:", error.response.data.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}

export default new PageService();