export function CustomerServicesTableSkeleton() {
  return (
    <div className="bg-gray-100 rounded-2xl p-4 overflow-hidden shadow-md animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {[...Array(6)].map((_, i) => (
                <th key={i} className="py-3 px-4">
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(3)].map((_, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="h-8 w-8 bg-gray-200 rounded ml-auto"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
