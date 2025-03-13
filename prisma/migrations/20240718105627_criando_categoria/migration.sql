/*
  Warnings:

  - You are about to drop the column `servico` on the `Anuncio` table. All the data in the column will be lost.
  - Added the required column `categoriaId` to the `Anuncio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Anuncio" DROP COLUMN "servico",
ADD COLUMN     "categoriaId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL,
    "servico" TEXT NOT NULL,
    "icone" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Anuncio" ADD CONSTRAINT "Anuncio_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
