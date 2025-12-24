'use client';

import { useActionState, useState } from "react";
import { createBook } from "@/lib/action/bookAction";
import { SubmitButton, BackButton } from "../Buttons";

interface CreateBookFormProps {
  currentUserId: string;
}

export default function CreateBookForm({ currentUserId }: CreateBookFormProps) {
  const [state, formAction] = useActionState(createBook, null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size should be less than 10MB");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a PDF first");

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        { method: "POST", body: formData }
      );

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setUploadedUrl(data.secure_url);
      alert("PDF uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Upload failed, try again");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-16 p-6 bg-white rounded-3xl shadow-xl border border-gray-100">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <BackButton />
        <h1 className="text-3xl font-bold text-gray-900">Publish New Book</h1>
      </div>

      <form action={formAction} className="space-y-6">

        {/* Hidden input */}
        <input type="hidden" name="writerId" value={currentUserId} />

        {/* Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Book Title</label>
          <input
            name="title"
            type="text"
            placeholder="Enter book title"
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {state?.Error?.title && (
            <p className="text-red-500 text-sm mt-1">{state.Error.title[0]}</p>
          )}
        </div>

        {/* Author */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Author Name</label>
          <input
            name="author"
            type="text"
            placeholder="Display author name"
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {state?.Error?.author && (
            <p className="text-red-500 text-sm mt-1">{state.Error.author[0]}</p>
          )}
        </div>

        {/* Genre */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Genre</label>
          <select
            name="genre"
            defaultValue=""
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="" disabled>Select a Genre</option>
            <option value="FICTION">Fiction</option>
            <option value="NON_FICTION">Non-Fiction</option>
          </select>
          {state?.Error?.genre && (
            <p className="text-red-500 text-sm mt-1">{state.Error.genre[0]}</p>
          )}
        </div>

        {/* Synopsis */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Synopsis</label>
          <textarea
            name="synopsis"
            rows={4}
            placeholder="Brief synopsis of the book"
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {state?.Error?.synopsis && (
            <p className="text-red-500 text-sm mt-1">{state.Error.synopsis[0]}</p>
          )}
        </div>

        {/* PDF Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Upload PDF</label>
          <div className="flex gap-3 items-center">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            <button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-400 transition-colors"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {uploadedUrl && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm break-all">
              PDF uploaded successfully: {uploadedUrl}
            </div>
          )}

          <input type="hidden" name="documentUrl" value={uploadedUrl} />
        </div>

        {/* Submit */}
        {state?.message && (
          <p className="text-red-500 text-center">{state.message}</p>
        )}
        <SubmitButton label="Publish Book" loadingText="Publishing..." />
      </form>
    </div>
  );
}
