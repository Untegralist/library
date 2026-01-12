'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Genre } from '@prisma/client';

// Zod schema (no changes needed)
const BookSchema = z.object({
  id: z.string().min(1, 'Book ID is required'),
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author name is required'),
  genre: z.enum(['FICTION', 'NON_FICTION']),
  synopsis: z.string().min(10, 'Synopsis must be at least 10 characters'),
  writerId: z.string().min(1, 'Writer ID is required'),
  documentUrl: z.string().url({ message: 'Invalid URL' }).optional().or(z.literal('')),
});

// Create book (unchanged)
export async function createBook(prevState: any, formData: FormData) {
  const validated = BookSchema.omit({ id: true }).safeParse(Object.fromEntries(formData));

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  try {
    await prisma.book.create({
      data: {
        title: validated.data.title,
        author: validated.data.author,
        genre: validated.data.genre as Genre,
        synopsis: validated.data.synopsis,
        writerId: validated.data.writerId,
        documentUrl: validated.data.documentUrl || null,
      },
    });
    revalidatePath('/user');
    redirect('/user');
  } catch (error) {
    console.error('Create book error:', error);
    return { message: 'Failed to create book' };
  }
}

// lib/action/bookAction.ts — updateBook
export async function updateBook(formData: FormData) {
  // Read values safely with .get()
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const author = formData.get('author') as string;
  const genre = formData.get('genre') as 'FICTION' | 'NON_FICTION';
  const synopsis = formData.get('synopsis') as string;
  const writerId = formData.get('writerId') as string;
  const documentUrl = formData.get('documentUrl') as string | null;

  // Manual validation (fallback if Zod fails on non-string values)
  if (!id) {
    return { success: false, message: 'Book ID is required' };
  }
  if (!title || title.trim() === '') {
    return { success: false, message: 'Title is required' };
  }
  if (!author || author.trim() === '') {
    return { success: false, message: 'Author is required' };
  }
  if (!['FICTION', 'NON_FICTION'].includes(genre)) {
    return { success: false, message: 'Please select Fiction or Non-Fiction' };
  }
  if (!synopsis || synopsis.length < 10) {
    return { success: false, message: 'Synopsis must be at least 10 characters' };
  }

  try {
    await prisma.book.update({
      where: { id },
      data: {
        title,
        author,
        genre: genre as Genre,
        synopsis,
        documentUrl: documentUrl || null,
      },
    });

    revalidatePath(`/books/${id}`);
    revalidatePath('/user');
    redirect(`/books/${id}`);
  } catch (error) {
    console.error('Update book error:', error);
    return { success: false, message: 'Failed to update book' };
  }
}
// Delete (unchanged)
// Delete book - now returns Promise<void> (no return object)
export async function deleteBook(id: string): Promise<void> {
  try {
    await prisma.book.delete({
      where: { id },
    });
    revalidatePath('/user');
    // Optional: redirect if you want
    // redirect('/user');
  } catch (error) {
    console.error('Delete book error:', error);
    throw new Error('Failed to delete book'); // Or handle in UI
  }
}