import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CategoryBadge = ({ category, size = "md" }) => {
  const sizes = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-2.5 py-1 text-sm gap-1.5",
    lg: "px-3 py-1.5 text-base gap-2",
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        sizes[size]
      )}
      style={{
        backgroundColor: `${category.color_c}15`,
        color: category.color_c,
      }}
    >
      <ApperIcon name={category.icon_c} size={iconSizes[size]} />
      <span>{category.name_c}</span>
    </span>
  );
};

export default CategoryBadge;