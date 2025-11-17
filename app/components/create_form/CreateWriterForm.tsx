'use client';

import { useActionState } from "react"; // Changed from useFormState
import { createWriter } from "@/lib/action/writerAction";
import { SubmitButton, BackButton } from "../Buttons";

export default function CreateWriterForm() {
  const [state, formAction] = useActionState(createWriter, null); // Changed from useFormState

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="mb-5">
        <BackButton />
        <h1 className="text-2xl font-bold text-gray-900">Register New Writer</h1>
      </div>

      <form action={formAction} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-gray-200">
        {/* ID / Username Field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="id">
            Writer ID (Username)
          </label>
          <input
            id="id"
            name="id"
            type="text"
            placeholder="e.g. doni123"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div id="id-error" aria-live="polite" aria-atomic="true">
            {state?.Error?.id && (
              <p className="mt-2 text-sm text-red-500">{state.Error.id[0]}</p>
            )}
          </div>
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="******************"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div id="password-error" aria-live="polite" aria-atomic="true">
            {state?.Error?.password && (
              <p className="mt-2 text-sm text-red-500">{state.Error.password[0]}</p>
            )}
          </div>
        </div>

        {/* General Error Message */}
        {state?.message && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded p-3">
            <p className="text-sm text-red-600 text-center">{state.message}</p>
          </div>
        )}

        <SubmitButton label="Create Writer" loadingText="Creating..." />
      </form>
    </div>
  );
}