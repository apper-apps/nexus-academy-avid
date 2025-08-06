const Loading = ({ className = "", type = "default" }) => {
  if (type === "cards") {
    return (
      <div className={`grid gap-6 ${className}`}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-navy-card rounded-xl p-6 animate-shimmer">
            <div className="h-6 bg-gray-700 rounded mb-4 w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded mb-3 w-full"></div>
            <div className="h-4 bg-gray-700 rounded mb-3 w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="h-10 bg-navy-card rounded animate-shimmer"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-navy-card rounded animate-shimmer"></div>
        ))}
      </div>
    );
  }

  if (type === "hero") {
    return (
      <div className={`${className}`}>
        <div className="h-12 bg-navy-card rounded mb-6 w-3/4 animate-shimmer"></div>
        <div className="h-6 bg-gray-700 rounded mb-4 w-full animate-shimmer"></div>
        <div className="h-6 bg-gray-700 rounded mb-4 w-5/6 animate-shimmer"></div>
        <div className="h-6 bg-gray-700 rounded mb-8 w-2/3 animate-shimmer"></div>
        <div className="h-12 bg-electric rounded w-40 animate-shimmer"></div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 bg-electric rounded-full animate-pulse"></div>
        <div className="w-6 h-6 bg-electric/70 rounded-full animate-pulse delay-75"></div>
        <div className="w-6 h-6 bg-electric/40 rounded-full animate-pulse delay-150"></div>
      </div>
    </div>
  );
};

export default Loading;