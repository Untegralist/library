-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('FICTION', 'NON_FICTION', 'SCIFI', 'FANTASY', 'MYSTERY', 'ROMANCE', 'HORROR', 'HISTORY');

-- CreateTable
CREATE TABLE "Writer" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Writer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "publishedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "genre" "Genre" NOT NULL,
    "synopsis" TEXT NOT NULL,
    "documentName" TEXT,
    "documentType" TEXT,
    "documentUrl" TEXT,
    "writerId" TEXT NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_writerId_fkey" FOREIGN KEY ("writerId") REFERENCES "Writer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
