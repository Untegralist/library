'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Genre } from '@prisma/client';

// Export FormState type so it can be imported in other files
export type FormState = {
  success?: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

// Zod schema for validation
const BookSchema = z.object({
  id: z.string().min(1, 'Book ID is required'),
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author name is required'),
  genre: z.enum(['FICTION', 'NON_FICTION']),
  synopsis: z.string().min(10, 'Synopsis must be at least 10 characters'),
  writerId: z.string().min(1, 'Writer ID is required'),
  documentUrl: z.string().url({ message: 'Invalid URL' }).optional().or(z.literal('')),
});

// Create book action
export async function createBook(prevState: any, formData: FormData) {
  // Convert FormData to plain object
  const data: Record<string, string> = {};
  formData.forEach((value, key) => {
    data[key] = value.toString();
  });

  // Validate without 'id' field (it's auto-generated)
  const validated = BookSchema.omit({ id: true }).safeParse(data);

  if (!validated.success) {
    return { 
      success: false,
      errors: validated.error.flatten().fieldErrors 
    };
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
    return { 
      success: false,
      message: 'Failed to create book' 
    };
  }
}

// Update book action - MUST have (prevState, formData) signature for useFormState
export async function updateBook(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Convert FormData to plain object
  const data: Record<string, string> = {};
  formData.forEach((value, key) => {
    data[key] = value.toString();
  });

  // Validate all fields including 'id'
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

    // Revalidate the cache for affected pages
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
      message: 'Failed to update book. Please try again.',
    };
  }
}

// Delete book action
export async function deleteBook(id: string): Promise<void> {
  try {
    await prisma.book.delete({
      where: { id },
    });
    
    revalidatePath('/user');
  } catch (error) {
    console.error('Delete book error:', error);
    throw new Error('Failed to delete book');
  }
}