export default function OrdersPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
      <div className="h-8 bg-gray-300 rounded w-32 mb-6"></div>

      {/* Order Cards */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 rounded w-16"></div>
                <div className="h-4 bg-gray-300 rounded w-48"></div>
              </div>
              <div className="h-6 bg-gray-300 rounded w-24"></div>
            </div>

            {/* Items */}
            <div className="space-y-2 mb-3">
              {[1, 2].map((j) => (
                <div key={j} className="flex items-center gap-3">
                  <div className="w-10 h-12 bg-gray-300 rounded shrink-0"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t pt-3 flex justify-between items-center">
              <div className="h-3 bg-gray-300 rounded w-32"></div>
              <div className="h-5 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
