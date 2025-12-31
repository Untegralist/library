// app/explore/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';

export default async function ExplorePage() {
  const books = await prisma.book.findMany({
    select: {
      id: true,
      title: true,
      author: true,
      synopsis: true,
      publishedDate: true,
      genre: true,
    },
    orderBy: { publishedDate: 'desc' },
  });

  return (
    <main className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-32">
        {/* Header */}
        <section className="text-center space-y-6 mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
            Jelajahi Semua Karya
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Temukan semua tulisan dari siswa SMP dan SMA di seluruh Indonesia — fiksi, non-fiksi, dan inspirasi baru setiap hari.
          </p>
        </section>

        {/* Empty State */}
        {books.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative w-64 h-64 mx-auto mb-8">
              <Image
                src="https://static.vecteezy.com/system/resources/previews/020/989/063/non_2x/open-book-in-flat-design-style-literature-for-reading-and-education-vector.jpg"
                alt="No books yet"
                fill
                className="object-contain opacity-50"
              />
            </div>
            <p className="text-2xl text-gray-500">
              Belum ada karya yang dipublikasikan.
            </p>
            <p className="text-gray-600 mt-4">
              Jadilah penulis pertama!
            </p>
          </div>
        ) : (
          /* All Books Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {books.map((book) => {
              const genreDisplay = book.genre === 'FICTION' ? 'Fiction' : 'Non-Fiction';
              const genreColor = book.genre === 'FICTION' ? 'blue' : 'green';

              return (
                <Link key={book.id} href={`/books/${book.id}`} className="block">
                  <div className="bg-white rounded-3xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
                    {/* Cover Placeholder */}
                    <div className="relative h-80 bg-gradient-to-br from-blue-100 to-indigo-200">
                      <Image
                        src="https://static.vecteezy.com/system/resources/previews/020/989/063/non_2x/open-book-in-flat-design-style-literature-for-reading-and-education-vector.jpg"
                        alt={book.title}
                        fill
                        className="object-contain p-12"
                      />
                      {/* Genre Badge */}
                      <div className={`absolute top-4 right-4 px-4 py-1 rounded-full text-white text-sm font-semibold bg-${genreColor}-600`}>
                        {genreDisplay}
                      </div>
                    </div>

                    {/* Book Info */}
                    <div className="p-8 space-y-4">
                      <h3 className="text-2xl font-bold text-gray-900 line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 font-medium">Oleh {book.author}</p>
                      {book.synopsis && (
                        <p className="text-gray-700 line-clamp-3">
                          {book.synopsis}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        Dipublikasikan {new Date(book.publishedDate).toLocaleDateString('id-ID')}
                      </p>
                      <div className="pt-4 border-t border-gray-100">
                        <span className="text-blue-600 font-medium hover:underline">
                          Baca Selengkapnya →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}