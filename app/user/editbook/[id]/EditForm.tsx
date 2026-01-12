'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateBook } from '@/lib/action/bookAction';
import type { FormState } from '@/lib/action/bookAction';  // ← Use 'type' keyword
import Link from 'next/link';
import { useEffect } from 'react';

const initialState: FormState = {
  success: false,
  errors: {},
  message: '',
};

// Separate component for the submit button (required for useFormStatus)
function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {pending ? 'Saving...' : 'Save Changes'}
    </button>
  );
}

export function EditForm({ book }: { book: any }) {
  const [state, formAction] = useFormState(updateBook, initialState);

  // Redirect on success (client-side)
  useEffect(() => {
    if (state?.success) {
      window.location.href = `/books/${book.id}`;
    }
  }, [state, book.id]);

  return (
    <form action={formAction} className="bg-white rounded-3xl shadow-lg p-8 md:p-10 space-y-8 border border-gray-100">
      {/* Hidden fields */}
      <input type="hidden" name="id" value={book.id} />
      <input type="hidden" name="writerId" value={book.writerId} />
      {book.documentUrl && (
        <input type="hidden" name="documentUrl" value={book.documentUrl} />
      )}

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
        {state?.errors?.title && (
          <p className="text-red-500 text-sm mt-1">{state.errors.title[0]}</p>
        )}
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
        {state?.errors?.author && (
          <p className="text-red-500 text-sm mt-1">{state.errors.author[0]}</p>
        )}
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
        {state?.errors?.genre && (
          <p className="text-red-500 text-sm mt-1">{state.errors.genre[0]}</p>
        )}
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
        {state?.errors?.synopsis && (
          <p className="text-red-500 text-sm mt-1">{state.errors.synopsis[0]}</p>
        )}
      </div>

      {/* PDF URL (Read-only) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current PDF Document
        </label>
        <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600">
          {book.documentUrl ? (
            <a 
              href={book.documentUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline"
            >
              View Current PDF
            </a>
          ) : (
            'No PDF uploaded yet'
          )}
        </div>
      </div>

      {/* Form feedback */}
      {state?.message && !state.success && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {state.message}
        </div>
      )}
      {state?.success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
          Book updated successfully! Redirecting...
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <SubmitButton />
        <Link
          href="/user"
          className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-medium hover:bg-gray-300 transition text-center"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}