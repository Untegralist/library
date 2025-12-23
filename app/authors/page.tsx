import React from 'react'
import { prisma } from "@/lib/prisma";

export default async function AuthorsPage() {
  const writers = await prisma.writer.findMany({
    include: {
      books: true, // fetch related books
    },
    orderBy: {
      id: "asc",
    },
  });

  return (
    <main className="max-w-5xl mx-auto px-8 pt-24">
      <h1 className="text-3xl font-bold mb-6">List Of Authors</h1>

      {writers.length === 0 ? (
        <p className="text-gray-500">No authors found.</p>
      ) : (
        <ul className="space-y-6">
          {writers.map((writer) => (
            <li
              key={writer.id}
              className="border rounded-lg p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold">
                {writer.id}
              </h2>

              <p className="text-gray-600 mt-1">
                Books written: {writer.books.length}
              </p>

              {writer.books.length > 0 && (
                <ul className="mt-3 list-disc list-inside text-gray-700">
                  {writer.books.map((book) => (
                    <li key={book.id}>{book.title}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

