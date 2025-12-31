// app/genres/[genre]/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';

type Props = {
  params: { genre?: string };
};

export default async function GenrePage({ params }: Props) {
  // Prevent crash if someone visits /genres directly
  if (!params?.genre) {
    redirect('/');
  }

  const genreSlug = params.genre.toLowerCase();

  // Map URL slug → database enum value (uppercase as in your schema)
  const genreMap: Record<string, 'FICTION' | 'NON_FICTION'> = {
    fiction: 'FICTION',
    'non-fiction': 'NON_FICTION',
  };

  const dbGenre = genreMap[genreSlug];

  // Invalid genre → 404
  if (!dbGenre) {
    notFound();
  }

  // Fetch books from database
  const books = await prisma.book.findMany({
    where: { genre: dbGenre }, // Perfect match with your enum
    select: {
      id: true,
      title: true,
      author: true,
      synopsis: true,
      publishedDate: true,
    },
    orderBy: { publishedDate: 'desc' },
  });

  const genreDisplay = dbGenre === 'FICTION' ? 'Fiction' : 'Non-Fiction';

  return (
    <main className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-32">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
            Karya <span className="text-blue-600">{genreDisplay}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Jelajahi semua tulisan {genreDisplay.toLowerCase()} dari siswa SMP dan SMA di seluruh Indonesia.
          </p>
          <Link href="/" className="inline-block mt-4 text-blue-600 hover:underline">
            ← Kembali ke Beranda
          </Link>
        </div>

        {/* Empty State */}
        {books.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-64 h-64 relative mb-8">
              <Image
                src="https://static.vecteezy.com/system/resources/previews/020/989/063/non_2x/open-book-in-flat-design-style-literature-for-reading-and-education-vector.jpg"
                alt="No books"
                fill
                className="object-contain opacity-50"
              />
            </div>
            <p className="text-2xl text-gray-500">
              Belum ada karya {genreDisplay.toLowerCase()} saat ini.
            </p>
            <p className="text-gray-600 mt-4">
              Jadilah yang pertama mengunggah!
            </p>
          </div>
        ) : (
          /* Book Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {books.map((book) => (
              <Link key={book.id} href={`/books/${book.id}`} className="block">
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
                  <div className="relative h-80 bg-gradient-to-br from-blue-100 to-indigo-200">
                    <Image
                      src="https://static.vecteezy.com/system/resources/previews/020/989/063/non_2x/open-book-in-flat-design-style-literature-for-reading-and-education-vector.jpg"
                      alt={book.title}
                      fill
                      className="object-contain p-12"
                    />
                  </div>
                  <div className="p-8 space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-gray-600">Oleh {book.author}</p>
                    {book.synopsis && (
                      <p className="text-gray-700 line-clamp-3">{book.synopsis}</p>
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
            ))}
          </div>
        )}
      </div>
    </main>
  );
}