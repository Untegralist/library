import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { 
  BookOpen, 
  Calendar, 
  User, 
  Download, 
  FileText, 
  ArrowLeft, 
  Clock 
} from 'lucide-react';
import Link from 'next/link';

// Import your specific function
import { getBookById } from '@/lib/get/getBook';

interface PageProps {
  // In Next.js 15, params is a Promise
  params: Promise<{
    id: string;
  }>;
}

const BookDetailsPage = async ({ params }: PageProps) => {
  // 1. Await the params to get the ID (Fixes Next.js 15 issues)
  const { id } = await params;

  // 2. Fetch data using the awaited ID
  const book = await getBookById(id);

  // Handle 404 if book doesn't exist
  if (!book) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto w-full">
          <Link 
            href="/books" 
            className="inline-flex items-center text-gray-500 hover:text-gray-900 transition-colors font-medium text-sm"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Library
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* --- Hero Header --- */}
          <div className="bg-slate-900 relative overflow-hidden">
            {/* Abstract Background Decoration */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-indigo-500 rounded-full opacity-10 blur-3xl"></div>

            <div className="relative z-10 px-8 py-12 md:py-16">
              {/* Genre Pill */}
              <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
                <BookOpen size={14} />
                <span>{book.genre}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {book.title}
              </h1>

              {/* Meta Data Row */}
              <div className="flex flex-wrap items-center gap-6 text-slate-300">
                {/* Writer/Uploader */}
                <div className="flex items-center space-x-3 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50">
                  <div className="bg-blue-600 rounded-full p-1">
                    <User size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 leading-none">Uploaded By</p>
                    <span className="text-sm font-medium text-white">@{book.writerId}</span>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar size={18} className="text-slate-400" />
                  <span>{book.publishedDate ? format(new Date(book.publishedDate), 'PPP') : 'Unknown Date'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* --- Main Content Grid --- */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Left Column: Synopsis */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">
                    Synopsis
                  </h2>
                  <div className="prose prose-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {book.synopsis}
                  </div>
                </div>

                {/* Technical Details */}
                <div className="grid grid-cols-2 gap-4 pt-8 mt-8 border-t border-gray-100">
                   <div>
                      <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Book ID</span>
                      <span className="font-mono text-xs text-gray-500">{book.id}</span>
                   </div>
                   <div>
                      <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Updated</span>
                      <span className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock size={14} className="mr-1"/> Recently
                      </span>
                   </div>
                </div>
              </div>

              {/* Right Column: Sidebar Actions */}
              <div className="space-y-8">
                
                {/* Author Info Card */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                    Author Details
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm">
                      <User size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{book.author}</p>
                      <p className="text-sm text-gray-500">Pen Name</p>
                    </div>
                  </div>
                </div>

                {/* Download Card */}
                {book.documentUrl ? (
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 relative overflow-hidden">
                    <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-4 relative z-10">
                      Attached Document
                    </h3>
                    
                    <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm mb-4 flex items-center gap-3 relative z-10">
                      <div className="bg-red-50 text-red-500 p-2 rounded-md">
                        <FileText size={20} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {book.documentName || 'Untitled'}
                        </p>
                        <p className="text-xs text-gray-500 uppercase">
                          {book.documentType || 'FILE'}
                        </p>
                      </div>
                    </div>

                    <a
                      href={book.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors shadow-lg shadow-blue-200 font-medium relative z-10"
                    >
                      <Download size={18} className="mr-2" />
                      Download / Read
                    </a>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 border-dashed text-center">
                    <FileText className="mx-auto text-gray-300 mb-2" size={32} />
                    <p className="text-sm text-gray-500">No document attached.</p>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookDetailsPage;