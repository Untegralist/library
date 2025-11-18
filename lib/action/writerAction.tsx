/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

// Define schema based on your Writer model
const WriterSchema = z.object({
  id: z.string().min(3, "ID must be at least 3 characters"), // This acts as the Username
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const createWriter = async (prevState: any, formData: FormData) => {
  // Check if user is admin
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.id !== 'admin') {
    return { message: "Unauthorized: Admin access required" };
  }

  const validatedFields = WriterSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      Error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.writer.create({
      data: {
        id: validatedFields.data.id,
        password: validatedFields.data.password, 
      },
    });
  } catch (error: any) {
    // P2002 is Prisma's error code for "Unique constraint failed" (Duplicate ID)
    if (error.code === 'P2002') {
        return { message: "This Writer ID already exists." };
    }
    return { message: "Failed to create writer" };
  }

  revalidatePath("/admin");
  redirect("/admin");
};

export const updateWriter = async (
  id: string,
  prevState: any,
  formData: FormData
) => {
  // Check if user is admin
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.id !== 'admin') {
    return { message: "Unauthorized: Admin access required" };
  }

  // We usually only allow updating the password, not the ID (since ID is the PK)
  const UpdateWriterSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const validatedFields = UpdateWriterSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      Error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.writer.update({
      data: validatedFields.data,
      where: { id },
    });
  } catch (error) {
    return { message: "Failed to update writer" };
  }

  revalidatePath("/writers");
  redirect("/writers");
};

export const deleteWriter = async (id: string): Promise<void> => {
  // Check if user is admin
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.id !== 'admin') {
    throw new Error("Unauthorized: Admin access required");
  }

  try {
    await prisma.writer.delete({
      where: { id },
    });
    revalidatePath("/writers");
  } catch (error) {
    console.error("Failed to delete writer:", error);
    throw new Error("Failed to delete writer");
  }
};