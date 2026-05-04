export default function AdminDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="h-8 bg-gray-300 rounded w-48"></div>
            <div className="h-4 bg-gray-300 rounded w-64"></div>
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-gray-300 rounded w-24"></div>
          ))}
        </div>

        {/* Tab content - showing cards */}
        <div className="space-y-4">
          {/* Stats skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-5 space-y-3">
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>

          {/* List items skeleton */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-5 space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                  <div className="h-3 bg-gray-300 rounded w-48"></div>
                </div>
                <div className="h-9 bg-gray-300 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
