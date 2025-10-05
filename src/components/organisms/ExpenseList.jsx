import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import CategoryBadge from "@/components/molecules/CategoryBadge";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import { formatCurrency, formatDate } from "@/utils/formatters";

const ExpenseList = ({ expenses, categories, onEdit, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editNote, setEditNote] = useState("");
  const [filter, setFilter] = useState("");

  const getCategoryById = (categoryId) => {
return categories.find(cat => cat.Id === categoryId);
  };

  const filteredExpenses = expenses.filter(expense => {
    const category = getCategoryById(expense.category_id_c);
    if (!category) return false;
    
    const searchLower = filter.toLowerCase();
    return (
      category.name_c.toLowerCase().includes(searchLower) ||
      (expense.note_c && expense.note_c.toLowerCase().includes(searchLower)) ||
      formatCurrency(expense.amount_c).toLowerCase().includes(searchLower)
    );
  });

  const handleEdit = (expense) => {
setEditingId(expense.Id);
    setEditAmount(expense.amount_c.toString());
    setEditNote(expense.note_c || "");
  };

  const handleSaveEdit = async (expense) => {
    try {
      const amount = parseFloat(editAmount);
      if (isNaN(amount) || amount <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }
      await onEdit(expense.Id, {
        amount_c: parseFloat(editAmount),
        note_c: editNote.trim(),
      });
      setEditingId(null);
      toast.success("Expense updated successfully!");
    } catch (error) {
      toast.error("Failed to update expense");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditAmount("");
    setEditNote("");
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await onDelete(expenseId);
        toast.success("Expense deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete expense");
      }
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-accent/10 rounded-lg">
            <ApperIcon name="Receipt" size={24} className="text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Expenses</h2>
            <p className="text-sm text-slate-600">{filteredExpenses.length} transactions</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <ApperIcon
            name="Search"
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            type="text"
            placeholder="Search expenses..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        <AnimatePresence>
          {filteredExpenses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="inline-flex p-4 bg-slate-100 rounded-full mb-4">
                <ApperIcon name="SearchX" size={32} className="text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium mb-1">No expenses found</p>
              <p className="text-sm text-slate-500">
                {filter ? "Try adjusting your search" : "Add your first expense to get started"}
              </p>
            </motion.div>
          ) : (
filteredExpenses.map((expense, index) => {
              const category = getCategoryById(expense.category_id_c);
              if (!category) return null;

              const isEditing = editingId === expense.Id;
              return (
                <motion.div
                  key={expense.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white p-4 rounded-lg shadow-card hover:shadow-card-hover transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {category && <CategoryBadge category={category} size="sm" />}
                      <div className="flex-1 min-w-0">
                        {isEditing ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Amount
                              </label>
                              <Input
                                type="number"
                                value={editAmount}
                                onChange={(e) => setEditAmount(e.target.value)}
                                min="0"
                                step="0.01"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Note
                              </label>
                              <Input
                                value={editNote}
                                onChange={(e) => setEditNote(e.target.value)}
                                placeholder="Add a note..."
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleSaveEdit(expense)}
                              >
                                <ApperIcon name="Check" size={14} />
                                Save
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="font-semibold text-lg">
                                {formatCurrency(expense.amount_c)}
                              </span>
                              <span className="text-sm text-slate-500">
                                {formatDate(expense.date_c)}
                              </span>
                            </div>
                            {expense.note_c && (
                              <p className="text-sm text-slate-600 mt-1">
                                {expense.note_c}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {!isEditing && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(expense)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100"
                        >
                          <ApperIcon name="Edit2" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(expense.Id)}
                          className="p-1.5 text-error hover:bg-error/10"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      </div>
                    )}
                  </div>
</motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default ExpenseList;