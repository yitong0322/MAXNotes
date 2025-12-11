import React from 'react';

const ProductSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col h-full relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3] bg-gray-100 animate-pulse"></div>

      <div className="flex-1 flex flex-col p-6 space-y-4">
        {/* Meta Skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-3 w-16 bg-gray-100 rounded animate-pulse"></div>
          <div className="h-3 w-20 bg-gray-100 rounded animate-pulse"></div>
        </div>

        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-6 w-3/4 bg-gray-100 rounded animate-pulse"></div>
          <div className="h-6 w-1/2 bg-gray-100 rounded animate-pulse"></div>
        </div>

        {/* Desc Skeleton */}
        <div className="space-y-2 pt-2">
          <div className="h-3 w-full bg-gray-50 rounded animate-pulse"></div>
          <div className="h-3 w-full bg-gray-50 rounded animate-pulse"></div>
          <div className="h-3 w-2/3 bg-gray-50 rounded animate-pulse"></div>
        </div>

        {/* Footer Skeleton */}
        <div className="mt-auto flex items-center justify-between pt-5 border-t border-gray-50">
           <div className="h-6 w-16 bg-gray-100 rounded animate-pulse"></div>
           <div className="h-8 w-20 bg-gray-100 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;