export default function CartPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
      <div className="h-8 bg-gray-300 rounded w-32 mb-6"></div>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
            <div className="w-16 h-20 bg-gray-300 rounded-md shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-7 bg-gray-300 rounded-full"></div>
              <div className="w-6 h-4 bg-gray-300 rounded"></div>
              <div className="size-7 bg-gray-300 rounded-full"></div>
            </div>
            <div className="size-6 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between mb-4 pb-4 border-b border-gray-200">
          <div className="h-5 bg-gray-300 rounded w-20"></div>
          <div className="h-6 bg-gray-300 rounded w-24"></div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 h-10 bg-gray-300 rounded-lg"></div>
          <div className="flex-1 h-10 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
