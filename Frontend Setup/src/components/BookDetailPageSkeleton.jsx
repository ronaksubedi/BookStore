import { FiArrowLeft } from "react-icons/fi";

export default function BookDetailPageSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen py-8 animate-pulse">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <div className="flex items-center gap-2 mb-8">
          <FiArrowLeft size={20} className="text-gray-300" />
          <div className="h-5 bg-gray-300 rounded w-32"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Book Image */}
            <div className="flex items-center justify-center">
              <div className="w-full aspect-2/3 bg-gray-300 rounded-xl max-w-sm"></div>
            </div>

            {/* Book Info */}
            <div className="space-y-6">
              {/* Category & Title */}
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="space-y-2">
                  <div className="h-8 bg-gray-300 rounded w-full"></div>
                  <div className="h-8 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-5 h-5 bg-gray-300 rounded-full"></div>
                  ))}
                </div>
                <div className="h-4 bg-gray-300 rounded w-32"></div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>

              {/* Price Section */}
              <div className="space-y-3 py-4 border-y border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="h-8 bg-gray-300 rounded w-24"></div>
                  <div className="h-6 bg-gray-300 rounded w-20"></div>
                  <div className="h-6 bg-gray-300 rounded w-16"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-5 bg-gray-300 rounded w-20"></div>
                  <div className="h-5 bg-gray-300 rounded w-20"></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 h-12 bg-gray-300 rounded-lg"></button>
                <button className="flex-1 h-12 bg-gray-300 rounded-lg"></button>
              </div>

              {/* Additional Info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
