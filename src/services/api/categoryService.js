// ApperClient initialized globally through ApperUI.setup in App.jsx
// Service methods use authenticated context automatically
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const categoryService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "monthly_limit_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords("category_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || "Failed to fetch categories");
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.map(cat => ({
        Id: cat.Id,
        name_c: cat.name_c,
        monthly_limit_c: cat.monthly_limit_c || 0,
        color_c: cat.color_c,
        icon_c: cat.icon_c
      }));
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      throw error;
    }
  },

getById: async (id) => {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "monthly_limit_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById("category_c", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || "Category not found");
      }
      
      if (!response.data) {
        throw new Error("Category not found");
      }
      
      return {
        Id: response.data.Id,
        name_c: response.data.name_c,
        monthly_limit_c: response.data.monthly_limit_c || 0,
        color_c: response.data.color_c,
        icon_c: response.data.icon_c
      };
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error.message);
      throw error;
    }
  },

update: async (id, data) => {
    try {
      const apperClient = getApperClient();
      const updateData = {};
      if (data.monthly_limit_c !== undefined) {
        updateData.monthly_limit_c = parseFloat(data.monthly_limit_c);
      }
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      };
      
      const response = await apperClient.updateRecord("category_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || "Failed to update category");
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update category:`, failed);
          throw new Error(failed[0].message || "Failed to update category");
        }
        
        return response.results[0].data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error updating category:", error.message);
      throw error;
    }
  }
};

export default categoryService;