import { prisma } from "../prisma";

export async function getBook() {
    try {
        const ship = await prisma.book.findMany();
        return ship;
    } catch (error) {
        console.error('Error fetching writers', error);
        throw error;
    }
}

export async function getBookById (id: string) {
    try {
        const book = await prisma.book.findUnique({
            where:{ id },
            });
            return book;
    } catch (error) {
        console.error('Error fetching Book with ID ${id}:', error);
        throw error;
    }
}