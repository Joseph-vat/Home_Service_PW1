/*
  Warnings:

  - The primary key for the `Cliente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Cliente` table. All the data in the column will be lost.
  - The primary key for the `PrestadorServico` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PrestadorServico` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cliente" DROP CONSTRAINT "Cliente_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "PrestadorServico" DROP CONSTRAINT "PrestadorServico_pkey",
DROP COLUMN "id";
