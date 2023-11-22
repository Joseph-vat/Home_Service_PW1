/*
  Warnings:

  - You are about to drop the column `userprestador` on the `PrestadorServico` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `PrestadorServico` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `PrestadorServico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PrestadorServico_userprestador_key";

-- AlterTable
ALTER TABLE "PrestadorServico" DROP COLUMN "userprestador",
ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "senha" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PrestadorServico_email_key" ON "PrestadorServico"("email");
