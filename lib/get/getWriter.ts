import { prisma } from "../prisma";

export async function getWriter() {
    try {
        const ship = await prisma.writer.findMany();
        return ship;
    } catch (error) {
        console.error('Error fetching writers', error);
        throw error;
    }
}

export async function getWriterById (id: string) {
    try {
        const writer = await prisma.writer.findUnique({
            where:{ id },
            });
            return writer;
    } catch (error) {
        console.error('Error fetching Writer with ID ${id}:', error);
        throw error;
    }
}