export default function ContactPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 animate-pulse">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <div className="h-10 bg-gray-300 rounded w-64 mx-auto"></div>
          <div className="space-y-2 max-w-2xl mx-auto">
            <div className="h-5 bg-gray-300 rounded w-full"></div>
            <div className="h-5 bg-gray-300 rounded w-5/6 mx-auto"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-4">
            <div className="h-7 bg-gray-300 rounded w-40 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                  <div className="h-10 bg-gray-300 rounded w-full"></div>
                </div>
              ))}
            </div>
            <div className="h-11 bg-gray-300 rounded w-full mt-6"></div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 flex gap-4">
                <div className="size-12 bg-gray-300 rounded-lg shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-300 rounded w-24"></div>
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                  <div className="h-4 bg-gray-300 rounded w-40"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map skeleton */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="h-7 bg-gray-300 rounded w-40 mb-6"></div>
          <div className="h-64 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}
