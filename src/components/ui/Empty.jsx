import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = "Nothing to see here yet",
  description = "Get started by adding your first item.",
  actionLabel,
  onAction,
  icon = "Inbox",
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="w-20 h-20 bg-electric/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-electric/60" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-3">
        {title}
      </h3>
      
      <p className="text-gray-400 mb-8 max-w-md">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-electric hover:bg-electric-hover text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default Empty;