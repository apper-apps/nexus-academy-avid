import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className,
  hover = false,
  children,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-navy-card rounded-xl border border-gray-700/50 shadow-lg",
        hover && "transition-all duration-200 hover:border-electric/50 hover:shadow-xl hover:shadow-electric/10 transform hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;