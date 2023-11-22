/*
  Warnings:

  - You are about to drop the column `email` on the `PrestadorServico` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userprestador]` on the table `PrestadorServico` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `senha` to the `PrestadorServico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userprestador` to the `PrestadorServico` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PrestadorServico_email_key";

-- AlterTable
ALTER TABLE "PrestadorServico" DROP COLUMN "email",
ADD COLUMN     "senha" TEXT NOT NULL,
ADD COLUMN     "userprestador" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PrestadorServico_userprestador_key" ON "PrestadorServico"("userprestador");
