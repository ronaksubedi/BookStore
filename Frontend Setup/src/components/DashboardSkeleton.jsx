import { HiOutlineUser } from "react-icons/hi";

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        {/* Header skeleton */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="size-16 rounded-full bg-gray-300"></div>
            <div className="space-y-2 flex-1">
              <div className="h-6 bg-gray-300 rounded w-32"></div>
              <div className="h-4 bg-gray-300 rounded w-48"></div>
              <div className="h-5 bg-gray-300 rounded w-20"></div>
            </div>
          </div>
          <div className="h-10 bg-gray-300 rounded w-24"></div>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-5 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>

        {/* Quick Links skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-5 space-y-3">
              <div className="h-5 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-10 bg-gray-300 rounded w-full"></div>
            </div>
          ))}
        </div>

        {/* Profile section skeleton */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div className="h-6 bg-gray-300 rounded w-32"></div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-10 bg-gray-300 rounded w-full"></div>
              </div>
            ))}
          </div>
          <div className="h-10 bg-gray-300 rounded w-32"></div>
        </div>
      </div>
    </div>
  );
}
