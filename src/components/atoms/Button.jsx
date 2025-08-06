import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className,
  variant = "primary",
  size = "md",
  children,
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-midnight disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-electric hover:bg-electric-hover text-white focus:ring-electric border-0 transform hover:scale-105 shadow-lg hover:shadow-xl",
    secondary: "bg-navy-card hover:bg-navy-light text-white border border-gray-600 hover:border-electric/50 focus:ring-electric",
    ghost: "bg-transparent hover:bg-navy-light text-gray-300 hover:text-white focus:ring-electric",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 transform hover:scale-105",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg",
    xl: "px-8 py-4 text-lg rounded-xl",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && "transform-none hover:scale-100",
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;