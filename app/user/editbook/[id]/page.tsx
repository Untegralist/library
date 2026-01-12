// app/user/editbook/[id]/page.tsx
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { updateBook } from '@/lib/action/bookAction';
import { notFound } from 'next/navigation';
import Link from 'next/link'; // ← Fixed import (not from lucide-react)

type Props = {
  params: { id: string };
};

export default async function EditBookPage({ params }: Props) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  const book = await prisma.book.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      title: true,
      author: true,
      synopsis: true,
      genre: true,
      documentUrl: true,
      writerId: true,
    },
  });

  if (!book) {
    notFound();
  }

  if (book.writerId !== session.user.id) {
    redirect('/user');
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Edit Book
          </h1>
          <p className="text-gray-500 mt-2">
            Update your story details below.
          </p>
        </div>

        {/* Edit Form */}
        <form
          action={updateBook} // ← Now correct (single-argument action)
          className="bg-white rounded-3xl shadow-lg p-8 md:p-10 space-y-8 border border-gray-100"
        >
          <input type="hidden" name="id" value={book.id} />

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={book.title}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter book title"
            />
          </div>

          {/* Author */}
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
              Author (Your Name)
            </label>
            <input
              type="text"
              id="author"
              name="author"
              defaultValue={book.author}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Your name as author"
            />
          </div>

          {/* Genre */}
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
              Genre
            </label>
            <select
              id="genre"
              name="genre"
              defaultValue={book.genre}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
            >
              <option value="FICTION">Fiction</option>
              <option value="NON_FICTION">Non-Fiction</option>
            </select>
          </div>

          {/* Synopsis */}
          <div>
            <label htmlFor="synopsis" className="block text-sm font-medium text-gray-700 mb-2">
              Synopsis
            </label>
            <textarea
              id="synopsis"
              name="synopsis"
              defaultValue={book.synopsis || ''}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Write a short description of your book..."
            />
          </div>

          {/* PDF URL (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current PDF Document
            </label>
            <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600">
              {book.documentUrl ? (
                <a href={book.documentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  View Current PDF
                </a>
              ) : (
                'No PDF uploaded yet'
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
            <Link
              href="/user"
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-medium hover:bg-gray-300 transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}