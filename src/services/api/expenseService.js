const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const expenseService = {
  getAll: async () => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "note_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };
      
      const response = await apperClient.fetchRecords("expense_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || "Failed to fetch expenses");
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.map(exp => ({
        Id: exp.Id,
        amount_c: exp.amount_c || 0,
        category_id_c: exp.category_id_c?.Id || exp.category_id_c,
        date_c: exp.date_c,
        note_c: exp.note_c || "",
        created_at_c: exp.created_at_c
      }));
    } catch (error) {
      console.error("Error fetching expenses:", error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "note_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById("expense_c", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || "Expense not found");
      }
      
      if (!response.data) {
        throw new Error("Expense not found");
      }
      
      return {
        Id: response.data.Id,
        amount_c: response.data.amount_c || 0,
        category_id_c: response.data.category_id_c?.Id || response.data.category_id_c,
        date_c: response.data.date_c,
        note_c: response.data.note_c || "",
        created_at_c: response.data.created_at_c
      };
    } catch (error) {
      console.error(`Error fetching expense ${id}:`, error.message);
      throw error;
    }
  },

  create: async (expenseData) => {
    try {
      const params = {
        records: [{
          amount_c: parseFloat(expenseData.amount_c),
          category_id_c: parseInt(expenseData.category_id_c),
          date_c: expenseData.date_c,
          note_c: expenseData.note_c || "",
          created_at_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord("expense_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || "Failed to create expense");
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create expense:`, failed);
          throw new Error(failed[0].message || "Failed to create expense");
        }
        
        return response.results[0].data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error creating expense:", error.message);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const updateData = {};
      if (data.amount_c !== undefined) {
        updateData.amount_c = parseFloat(data.amount_c);
      }
      if (data.note_c !== undefined) {
        updateData.note_c = data.note_c;
      }
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      };
      
      const response = await apperClient.updateRecord("expense_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || "Failed to update expense");
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update expense:`, failed);
          throw new Error(failed[0].message || "Failed to update expense");
        }
        
        return response.results[0].data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error updating expense:", error.message);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord("expense_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || "Failed to delete expense");
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete expense:`, failed);
          throw new Error(failed[0].message || "Failed to delete expense");
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting expense:", error.message);
      throw error;
    }
  },

  getByMonth: async (monthKey) => {
    try {
      const [year, month] = monthKey.split('-');
      const startDate = `${year}-${month}-01T00:00:00`;
      const endDate = new Date(parseInt(year), parseInt(month), 0);
      const endDateStr = `${year}-${month}-${endDate.getDate()}T23:59:59`;
      
      const params = {
        fields: [
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "note_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        where: [
          {
            "FieldName": "date_c",
            "Operator": "GreaterThanOrEqualTo",
            "Values": [startDate]
          },
          {
            "FieldName": "date_c",
            "Operator": "LessThanOrEqualTo",
            "Values": [endDateStr]
          }
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };
      
      const response = await apperClient.fetchRecords("expense_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || "Failed to fetch expenses for month");
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.map(exp => ({
        Id: exp.Id,
        amount_c: exp.amount_c || 0,
        category_id_c: exp.category_id_c?.Id || exp.category_id_c,
        date_c: exp.date_c,
        note_c: exp.note_c || "",
        created_at_c: exp.created_at_c
      }));
    } catch (error) {
      console.error("Error fetching expenses for month:", error.message);
      throw error;
    }
  }
};
export default expenseService;