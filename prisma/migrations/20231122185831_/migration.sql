/*
  Warnings:

  - Made the column `telefone` on table `PrestadorServico` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PrestadorServico" ALTER COLUMN "telefone" SET NOT NULL;
