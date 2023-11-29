/*
  Warnings:

  - You are about to drop the column `atualizadoEm` on the `Anuncio` table. All the data in the column will be lost.
  - You are about to drop the column `criadoEm` on the `Anuncio` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `PrestadorServico` table. All the data in the column will be lost.
  - You are about to drop the column `endereco` on the `PrestadorServico` table. All the data in the column will be lost.
  - You are about to drop the column `foto` on the `PrestadorServico` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `PrestadorServico` table. All the data in the column will be lost.
  - You are about to drop the column `senha` on the `PrestadorServico` table. All the data in the column will be lost.
  - You are about to drop the column `telefone` on the `PrestadorServico` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cnpj]` on the table `PrestadorServico` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[usuarioIdPrestador]` on the table `PrestadorServico` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dtAtualizacao` to the `Anuncio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cnpj` to the `PrestadorServico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horarioDisponibilidade` to the `PrestadorServico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioIdPrestador` to the `PrestadorServico` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Anuncio" DROP CONSTRAINT "Anuncio_prestadorId_fkey";

-- DropIndex
DROP INDEX "PrestadorServico_email_key";

-- AlterTable
ALTER TABLE "Anuncio" DROP COLUMN "atualizadoEm",
DROP COLUMN "criadoEm",
ADD COLUMN     "dtAtualizacao" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dtCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "PrestadorServico" DROP COLUMN "email",
DROP COLUMN "endereco",
DROP COLUMN "foto",
DROP COLUMN "nome",
DROP COLUMN "senha",
DROP COLUMN "telefone",
ADD COLUMN     "cnpj" TEXT NOT NULL,
ADD COLUMN     "horarioDisponibilidade" TEXT NOT NULL,
ADD COLUMN     "usuarioIdPrestador" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "usuarioIdCliente" TEXT NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cpf_key" ON "Cliente"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_usuarioIdCliente_key" ON "Cliente"("usuarioIdCliente");

-- CreateIndex
CREATE UNIQUE INDEX "PrestadorServico_cnpj_key" ON "PrestadorServico"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "PrestadorServico_usuarioIdPrestador_key" ON "PrestadorServico"("usuarioIdPrestador");

-- AddForeignKey
ALTER TABLE "PrestadorServico" ADD CONSTRAINT "PrestadorServico_usuarioIdPrestador_fkey" FOREIGN KEY ("usuarioIdPrestador") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_usuarioIdCliente_fkey" FOREIGN KEY ("usuarioIdCliente") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anuncio" ADD CONSTRAINT "Anuncio_prestadorId_fkey" FOREIGN KEY ("prestadorId") REFERENCES "PrestadorServico"("usuarioIdPrestador") ON DELETE RESTRICT ON UPDATE CASCADE;
