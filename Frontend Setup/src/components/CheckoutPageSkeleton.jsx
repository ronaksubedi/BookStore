export default function CheckoutPageSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 animate-pulse">
      <div className="h-8 bg-gray-300 rounded w-40 mb-6"></div>

      {/* Order Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="h-6 bg-gray-300 rounded w-40 mb-4"></div>
        <div className="space-y-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-20"></div>
            </div>
          ))}
        </div>
        <div className="border-t pt-3 flex justify-between">
          <div className="h-5 bg-gray-300 rounded w-16"></div>
          <div className="h-5 bg-gray-300 rounded w-24"></div>
        </div>
      </div>

      {/* Delivery Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="h-6 bg-gray-300 rounded w-48 mb-5"></div>
        <div className="space-y-4">
          {/* Name field */}
          <div>
            <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="h-10 bg-gray-300 rounded w-full"></div>
          </div>

          {/* Address field */}
          <div>
            <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="h-24 bg-gray-300 rounded w-full"></div>
          </div>

          {/* Phone field */}
          <div>
            <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="h-10 bg-gray-300 rounded w-full"></div>
          </div>

          {/* Submit button */}
          <div className="h-11 bg-gray-300 rounded w-full mt-6"></div>
        </div>
      </div>
    </div>
  );
}
