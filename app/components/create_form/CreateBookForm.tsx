'use client';

import { useFormState } from "react-dom";
import { createBook } from "@/lib/action/bookAction";
import { SubmitButton, BackButton } from "../Buttons";

// We need to know WHO is creating the book
interface CreateBookFormProps {
  currentUserId: string; 
}

export default function CreateBookForm({ currentUserId }: CreateBookFormProps) {
  const [state, formAction] = useFormState(createBook, null);

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="mb-5">
        <BackButton />
        <h1 className="text-2xl font-bold text-gray-900">Publish New Book</h1>
      </div>

      <form action={formAction} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-gray-200">
        
        {/* HIDDEN INPUT: This links the book to the logged-in user */}
        <input type="hidden" name="writerId" value={currentUserId} />

        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Book Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <div aria-live="polite">
            {state?.Error?.title && <p className="text-red-500 text-xs italic mt-1">{state.Error.title[0]}</p>}
          </div>
        </div>

        {/* Author (Display Name) */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="author">
            Author Name (Display)
          </label>
          <input
            id="author"
            name="author"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <div aria-live="polite">
            {state?.Error?.author && <p className="text-red-500 text-xs italic mt-1">{state.Error.author[0]}</p>}
          </div>
        </div>

        {/* Genre Select */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="genre">
            Genre
          </label>
          <select
            id="genre"
            name="genre"
            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            defaultValue=""
          >
            <option value="" disabled>Select a Genre</option>
            <option value="FICTION">Fiction</option>
            <option value="NON_FICTION">Non-Fiction</option>
            <option value="SCIFI">Sci-Fi</option>
            <option value="FANTASY">Fantasy</option>
            <option value="MYSTERY">Mystery</option>
            <option value="ROMANCE">Romance</option>
            <option value="HORROR">Horror</option>
            <option value="HISTORY">History</option>
          </select>
          <div aria-live="polite">
            {state?.Error?.genre && <p className="text-red-500 text-xs italic mt-1">{state.Error.genre[0]}</p>}
          </div>
        </div>

        {/* Synopsis */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="synopsis">
            Synopsis
          </label>
          <textarea
            id="synopsis"
            name="synopsis"
            rows={4}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
          <div aria-live="polite">
            {state?.Error?.synopsis && <p className="text-red-500 text-xs italic mt-1">{state.Error.synopsis[0]}</p>}
          </div>
        </div>

        {/* Document URL (Optional) */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="documentUrl">
            Document URL (Optional)
          </label>
          <input
            id="documentUrl"
            name="documentUrl"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {state?.message && (
            <p className="mb-4 text-sm text-red-500 text-center">{state.message}</p>
        )}

        <SubmitButton label="Publish Book" loadingText="Publishing..." />
      </form>
    </div>
  );
}