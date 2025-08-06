import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className,
  type = "text",
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "w-full px-4 py-2.5 bg-navy-card border border-gray-600 rounded-lg text-white placeholder:text-gray-400",
        "focus:outline-none focus:ring-2 focus:ring-electric focus:border-electric transition-colors duration-200",
        "hover:border-gray-500",
        error && "border-red-500 focus:ring-red-500 focus:border-red-500",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;