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

export async function updateBook(formData: FormData): Promise<void> {
  const validated = BookSchema.safeParse(Object.fromEntries(formData));

  if (!validated.success) {
    // Instead of returning errors, throw or log – for server form we redirect on error
    throw new Error(
      validated.error.flatten().fieldErrors.title?.[0] ||
      validated.error.flatten().fieldErrors.author?.[0] ||
      'Validation failed. Please check your input.'
    );
  }

  const { id, ...data } = validated.data;

  if (!id) {
    throw new Error('Book ID is required for update');
  }

  try {
    await prisma.book.update({
      where: { id },
      data: {
        ...data,
        genre: data.genre as Genre,
      },
    });

    revalidatePath(`/books/${id}`);
    revalidatePath('/user');
    redirect(`/books/${id}`);
  } catch (error) {
    console.error('Update book error:', error);
    throw new Error('Failed to update book');
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