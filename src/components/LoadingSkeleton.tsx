import { memo } from 'react';

interface LoadingSkeletonProps {
  count?: number;
  type?: 'video' | 'channel' | 'analysis';
}

const LoadingSkeleton = memo(function LoadingSkeleton({ 
  count = 3, 
  type = 'video' 
}: LoadingSkeletonProps) {
  
  const VideoSkeleton = () => (
    <div className="neo-glass rounded-3xl overflow-hidden animate-pulse">
      <div className="p-4 flex gap-4">
        <div className="flex-shrink-0 w-56 space-y-3">
          <div className="w-full h-32 bg-gray-700/50 rounded-2xl"></div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 bg-gray-700/50 rounded-xl"></div>
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div className="h-6 bg-gray-700/50 rounded-lg w-3/4"></div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-700/50 rounded-full"></div>
            <div className="h-4 bg-gray-700/50 rounded w-32"></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="neo-glass rounded-xl p-3 space-y-2">
                <div className="h-3 bg-gray-700/50 rounded w-16"></div>
                <div className="h-4 bg-gray-700/50 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ChannelSkeleton = () => (
    <div className="neo-glass rounded-xl animate-pulse">
      <div className="p-6 flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-700/50 rounded-full"></div>
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-gray-700/50 rounded w-2/3"></div>
          <div className="h-4 bg-gray-700/50 rounded w-full"></div>
          <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
          <div className="flex gap-6">
            <div className="h-4 bg-gray-700/50 rounded w-20"></div>
            <div className="h-4 bg-gray-700/50 rounded w-16"></div>
            <div className="h-4 bg-gray-700/50 rounded w-24"></div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-20 h-8 bg-gray-700/50 rounded-lg"></div>
          <div className="w-16 h-8 bg-gray-700/50 rounded-lg"></div>
        </div>
      </div>
    </div>
  );

  const AnalysisSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="neo-glass rounded-xl p-4 text-center">
            <div className="h-8 bg-gray-700/50 rounded mb-2"></div>
            <div className="h-4 bg-gray-700/50 rounded w-20 mx-auto"></div>
          </div>
        ))}
      </div>
      <div className="neo-glass rounded-2xl overflow-hidden">
        <div className="p-4">
          <div className="h-6 bg-gray-700/50 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-gray-800/30 rounded-lg">
                <div className="w-8 h-8 bg-gray-700/50 rounded-full"></div>
                <div className="w-12 h-12 bg-gray-700/50 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700/50 rounded w-1/2"></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-16 h-6 bg-gray-700/50 rounded"></div>
                  <div className="w-12 h-6 bg-gray-700/50 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'video':
        return <VideoSkeleton />;
      case 'channel':
        return <ChannelSkeleton />;
      case 'analysis':
        return <AnalysisSkeleton />;
      default:
        return <VideoSkeleton />;
    }
  };

  if (type === 'analysis') {
    return renderSkeleton();
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  );
});

export default LoadingSkeleton;