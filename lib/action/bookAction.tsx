/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Match the Enum in your schema.prisma exactly
const GenreEnum = z.enum([
  "FICTION", "NON_FICTION"
]);

const BookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author name is required"),
  genre: GenreEnum,
  synopsis: z.string().min(10, "Synopsis must be at least 10 characters"),
  // We validate writerId here to ensure the book is linked to a user
  writerId: z.string().min(1, "Writer ID is required"), 
  // Optional fields
  documentUrl: z.string().optional(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createBook = async (prevState: any, formData: FormData) => {
  const validatedFields = BookSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      Error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.book.create({
      data: {
        title: validatedFields.data.title,
        author: validatedFields.data.author,
        genre: validatedFields.data.genre,
        synopsis: validatedFields.data.synopsis,
        writerId: validatedFields.data.writerId,
        documentUrl: validatedFields.data.documentUrl || "",
      },
    });
  } catch (error) {
    console.error(error); // Helpful to see why it failed in console
    return { message: "Failed to create book" };
  }

  revalidatePath("/user");
  redirect("/user");
};

export const updateBook = async (
  id: string,
  prevState: any,
  formData: FormData
) => {
  const validatedFields = BookSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      Error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.book.update({
      data: validatedFields.data,
      where: { id },
    });
  } catch (error) {
    return { message: "Failed to update book" };
  }

  revalidatePath("/books");
  redirect("/books");
};

export const deleteBook = async (id: string): Promise<void> => {
  try {
    await prisma.book.delete({
      where: { id },
    });
    revalidatePath("/books");
  } catch (error) {
    console.error("Failed to delete book:", error);
    throw new Error("Failed to delete book");
  }
};