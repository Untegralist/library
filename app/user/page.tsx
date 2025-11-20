import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getBooksByWriterId } from "@/lib/get/getBook";
import { deleteBook } from "@/lib/action/bookAction";
import { DeleteButton } from "../components/Buttons";

export default async function UserDashboard() {
  // 1. Authenticate
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // 2. Fetch Specific User Data
  // We use session.user.id to ensure we only get THIS user's books
  const books = await getBooksByWriterId(session.user.id);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Writer Studio
            </h1>
            <p className="text-gray-500 mt-1">
              Welcome back, <span className="font-semibold text-gray-800">{session.user.name}</span>. Here is what’s happening with your stories.
            </p>
          </div>
          
          <Link 
            href="/user/createbook"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white transition-all duration-200 bg-blue-600 rounded-full hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Write New Book
          </Link>
        </div>

        {/* --- Stats Grid --- */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-10">
          <StatCard title="Published Books" value={books.length.toString()} icon="book" />
          <StatCard title="Total Reads" value="-" icon="eye" />
          <StatCard title="Followers" value="-" icon="users" />
        </div>

        {/* --- Main Content Area --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-lg font-semibold text-gray-900">Your Books</h3>
            {books.length > 0 && (
              <span className="text-sm text-gray-500">{books.length} Total</span>
            )}
          </div>

          {/* --- Conditional Rendering based on Data --- */}
          {books.length === 0 ? (
            // 1. EMPTY STATE
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No books published yet</h3>
              <p className="text-gray-500 max-w-sm mb-8">
                You haven&apos;t published any stories. Share your imagination with the world today.
              </p>
              <Link 
                href="/user/createbook"
                className="text-blue-600 font-semibold hover:text-blue-700 hover:underline underline-offset-4"
              >
                Start posting your first book &rarr;
              </Link>
            </div>
          ) : (
            // 2. POPULATED LIST STATE
            <div className="divide-y divide-gray-100">
              {books.map((book) => (
                <div key={book.id} className="p-6 hover:bg-gray-50 transition-colors duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Icon/Thumbnail Placeholder */}
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 shrink-0">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{book.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {book.genre}
                        </span>
                        <span className="text-gray-400">
                          • Published by {book.author}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
                      Edit
                    </button>
                    <Link href={`/books/${book.id}`} className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-transparent rounded-lg hover:bg-blue-100 transition-colors">
                      View
                    </Link>
                    
                    {/* DELETE BUTTON ADDED HERE */}
                    <DeleteButton id={book.id} onDelete={deleteBook} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// --- Helper Component for Stats ---
function StatCard({ title, value, icon }: { title: string, value: string, icon: 'book' | 'eye' | 'users' }) {
  return (
    <div className="bg-white overflow-hidden rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-5 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
        <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="p-3 bg-gray-50 rounded-lg text-gray-400">
        {icon === 'book' && (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        )}
        {icon === 'eye' && (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
        {icon === 'users' && (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )}
      </div>
    </div>
  );
}