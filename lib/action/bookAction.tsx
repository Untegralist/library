'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Genre } from '@prisma/client';
import type { FormState } from '@/lib/form';  // Make sure this file exists and exports FormState

// Zod schema (unchanged from your version)
const BookSchema = z.object({
  id: z.string().min(1, 'Book ID is required'),
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author name is required'),
  genre: z.enum(['FICTION', 'NON_FICTION']),
  synopsis: z.string().min(10, 'Synopsis must be at least 10 characters'),
  writerId: z.string().min(1, 'Writer ID is required'),
  documentUrl: z.string().url({ message: 'Invalid URL' }).optional().or(z.literal('')),
});

// Create book (your original, with safe parsing)
export async function createBook(prevState: any, formData: FormData) {
  // Safe manual parsing (avoids any FormData iteration issues)
  const data: Record<string, string> = {};
  formData.forEach((value, key) => {
    data[key] = value.toString();
  });

  const validated = BookSchema.omit({ id: true }).safeParse(data);

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

// Update book – merged + safe + returns FormState
export async function updateBook(formData: FormData): Promise<FormState> {
  // Safe manual parsing (no crash even if formData is serialized)
  const data: Record<string, string> = {};
  formData.forEach((value, key) => {
    data[key] = value.toString();
  });

  const validated = BookSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: 'Validation failed',
    };
  }

  const { id, ...updateData } = validated.data;

  if (!id) {
    return {
      success: false,
      message: 'Book ID is required',
    };
  }

  try {
    await prisma.book.update({
      where: { id },
      data: {
        ...updateData,
        genre: updateData.genre as Genre,
      },
    });

    revalidatePath(`/books/${id}`);
    revalidatePath('/user');

    return {
      success: true,
      message: 'Book updated successfully',
    };
  } catch (error) {
    console.error('Update book error:', error);
    return {
      success: false,
      message: 'Failed to update book',
    };
  }
}

// Delete book (your original + void return)
export async function deleteBook(id: string): Promise<void> {
  try {
    await prisma.book.delete({
      where: { id },
    });
    revalidatePath('/user');
    // Optional: redirect('/user');
  } catch (error) {
    console.error('Delete book error:', error);
    throw new Error('Failed to delete book');
  }
}