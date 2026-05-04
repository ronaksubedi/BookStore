export default function BookGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
            {/* Image skeleton */}
            <div className="relative aspect-3/4 bg-gray-300"></div>

            {/* Content skeleton */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              {/* Category & Title */}
              <div>
                <div className="h-3 bg-gray-300 rounded w-16 mb-2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>

              {/* Price and Stock */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-5 bg-gray-300 rounded w-20"></div>
                  <div className="h-6 bg-gray-300 rounded w-16"></div>
                </div>
                <div className="h-3 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
