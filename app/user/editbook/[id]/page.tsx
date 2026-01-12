// app/user/editbook/[id]/page.tsx
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { EditForm } from './EditForm'; // ← Import the client form component

type Props = {
  params: Promise<{ id: string }>; // ← params is a Promise in server components
};

export default async function EditBookPage({ params: paramsPromise }: Props) {
  // Await params first
  const params = await paramsPromise;

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

        {/* Client-side Form for error handling */}
        <EditForm book={book} />
      </div>
    </div>
  );
}