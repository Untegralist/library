// app/books/[id]/page.tsx
import { prisma } from '@/lib/get/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = {
  params: { id: string };
};

export default async function BookPage({ params }: Props) {
  const book = await prisma.book.findUnique({
    where: { id: params.id },
    select: {
      title: true,
      author: true,
      synopsis: true,
      publishedDate: true,
      documentUrl: true,
      documentType: true,
      genre: true,
    },
  });

  if (!book || !book.documentUrl) notFound();

  const genreSlug = book.genre === 'FICTION' ? 'fiction' : 'non-fiction';
  const genreDisplay = book.genre === 'FICTION' ? 'Fiction' : 'Non-Fiction';

  return (
    <main className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-32 space-y-12">

        {/* Header */}
        <section className="text-center space-y-4">
          <Link
            href={`/genres/${genreSlug}`}
            className="inline-block text-blue-600 hover:underline"
          >
            ← Kembali ke {genreDisplay}
          </Link>

          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
            {book.title}
          </h1>

          <p className="text-2xl text-gray-600">Oleh {book.author}</p>

          <p className="text-gray-500">
            Dipublikasikan pada{' '}
            {new Date(book.publishedDate).toLocaleDateString('id-ID')}
          </p>
        </section>

        {/* Synopsis */}
        {book.synopsis && (
          <section className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-lg p-10 space-y-6">
              <h2 className="text-3xl font-bold">Sinopsis</h2>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {book.synopsis}
              </p>
            </div>
          </section>
        )}

        {/* PDF Viewer */}
        <section className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-4 text-center font-semibold text-xl">
              Baca Karya Lengkap
            </div>
            <iframe
              src={book.documentUrl}
              className="w-full h-screen min-h-[800px]"
              title={`PDF viewer for ${book.title}`}
              allowFullScreen
            />
          </div>
        </section>

      </div>
    </main>
  );
}