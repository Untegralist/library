import { getWriter } from "@/lib/get/getWriter";
import { deleteWriter } from "@/lib/action/writerAction";
import { DeleteButton } from "@/app/components/Buttons";

export default async function WritersViewPage() {
  const writers = await getWriter();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Writers Management</h1>
          <p className="text-gray-600 mt-2">View and manage all writers</p>
        </div>
      </div>

      {writers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No writers found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {writers.map((writer) => (
                <tr key={writer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {writer.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <DeleteButton 
                      id={writer.id} 
                      onDelete={deleteWriter}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4">
        <p className="text-sm text-gray-500">
          Total writers: {writers.length}
        </p>
      </div>
    </div>
  );
}