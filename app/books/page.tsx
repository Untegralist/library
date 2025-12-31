// app/books/page.tsx — List of ALL books
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AllBooksPage() {
  const books = await prisma.book.findMany({
    select: {
      id: true,
      title: true,
      author: true,
      genre: true,
      publishedDate: true,
    },
    orderBy: { publishedDate: 'desc' },
  });

  return (
    <main className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-32">
        <section className="text-center space-y-6 mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
            Semua Karya
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Koleksi lengkap tulisan dari siswa SMP dan SMA di seluruh Indonesia.
          </p>
        </section>

        {books.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">Belum ada karya yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {books.map((book) => (
              <Link key={book.id} href={`/books/${book.id}`} className="block">
                <div className="bg-white rounded-3xl shadow-lg p-8 space-y-4 hover:scale-105 transition duration-300">
                  <h3 className="text-2xl font-bold text-gray-900 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-gray-600">Oleh {book.author}</p>
                  <p className="text-sm text-gray-500">
                    {book.genre === 'FICTION' ? 'Fiction' : 'Non-Fiction'}
                  </p>
                  <span className="text-blue-600 font-medium hover:underline">
                    Baca Selengkapnya →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}