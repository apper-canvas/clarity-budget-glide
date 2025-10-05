import { motion } from "framer-motion";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import CategoryBadge from "@/components/molecules/CategoryBadge";
import ProgressBar from "@/components/atoms/ProgressBar";
import Card from "@/components/atoms/Card";
import { formatCurrency } from "@/utils/formatters";

const BudgetOverview = ({ budgets }) => {
  const getStatusIcon = (percentage) => {
    if (percentage < 70) return "CheckCircle2";
    if (percentage < 90) return "AlertCircle";
    return "XCircle";
  };

  const getStatusColor = (percentage) => {
    if (percentage < 70) return "text-success";
    if (percentage < 90) return "text-warning";
    return "text-error";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
{budgets.map((budget, index) => {
        const percentage = budget.monthly_limit_c > 0 
          ? (budget.spent / budget.monthly_limit_c) * 100 
          : 0;
        const remaining = Math.max(0, budget.monthly_limit_c - budget.spent);

        return (
          <motion.div
            key={budget.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4">
              <div className="space-y-3">
                <CategoryBadge category={budget} size="lg" />

                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Spent</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {formatCurrency(budget.spent)}
                    </p>
                  </div>
                </div>

                <ProgressBar value={budget.spent} max={budget.monthly_limit_c} />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    of {formatCurrency(budget.monthly_limit_c)}
                  </span>
                  <span className={percentage >= 100 ? "text-error font-medium" : "text-success font-medium"}>
                    {formatCurrency(remaining)} left
                  </span>
                </div>
</div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default BudgetOverview;