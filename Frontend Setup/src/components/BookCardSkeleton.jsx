export default function BookCardSkeleton() {
  return (
    <div className="rounded-lg p-2 w-full animate-pulse">
      <div className="flex flex-row items-start gap-4">
        {/* Image skeleton */}
        <div className="shrink-0 w-24 sm:w-32">
          <div className="w-full aspect-2/3 bg-gray-300 rounded-md"></div>
        </div>

        {/* Content skeleton */}
        <div className="flex flex-col flex-1 min-w-0 space-y-2">
          {/* Title skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>

          {/* Rating skeleton */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-4 h-4 bg-gray-300 rounded-full"></div>
              ))}
            </div>
          </div>

          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded w-full"></div>
            <div className="h-3 bg-gray-300 rounded w-4/5"></div>
          </div>

          {/* Price and button skeleton */}
          <div className="flex items-center justify-between mt-3">
            <div className="h-5 bg-gray-300 rounded w-16"></div>
            <div className="h-9 bg-gray-300 rounded w-9"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
