// app/admin/writers/view/page.tsx
import { getWriter } from "@/lib/get/getWriter";
import { deleteWriter } from "@/lib/action/writerAction";
import { DeleteButton } from "@/app/components/Buttons";
import type { Writer } from "@prisma/client"; // ← Add this import!

export default async function WritersViewPage() {
  const writers: Writer[] = await getWriter(); // ← Explicitly type the array

  return (
    <div className="min-h-screen bg-gray-50/50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Writer Directory
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              Manage access and permissions for content contributors.
            </p>
          </div>
          
          {/* Stat Badge */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="text-sm font-bold text-gray-700">
              {writers.length} {writers.length === 1 ? 'Active Writer' : 'Active Writers'}
            </span>
          </div>
        </div>

        {/* --- The List --- */}
        {writers.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-300 p-16 text-center">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No writers found</h3>
            <p className="text-gray-500 mt-1 max-w-sm">
              It looks like your database is empty. Go back to the dashboard to register a new writer.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 px-6 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <div className="col-span-8">Writer Identification</div>
              <div className="col-span-4 text-right">Actions</div>
            </div>

            {/* Data Rows */}
            {writers.map((writer: Writer) => ( // ← Type 'writer' here
              <div 
                key={writer.id} 
                className="group relative bg-white rounded-xl p-4 md:p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300 flex flex-col md:grid md:grid-cols-12 items-center gap-4"
              >
                {/* Left Stripe Decoration */}
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-blue-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                {/* ID / Info Section */}
                <div className="col-span-8 w-full flex items-center gap-4">
                  {/* Generated Avatar Icon */}
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center text-blue-600 font-bold shadow-inner">
                    {writer.id.slice(0, 2).toUpperCase()}
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 font-medium mb-0.5">System ID</span>
                    <code className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md font-mono border border-gray-200 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-100 transition-colors">
                      {writer.id}
                    </code>
                  </div>
                </div>

                {/* Action Section */}
                <div className="col-span-4 w-full flex justify-end">
                  <div className="opacity-100 md:opacity-60 md:group-hover:opacity-100 transition-opacity">
                    <DeleteButton 
                      id={writer.id} 
                      onDelete={deleteWriter} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}