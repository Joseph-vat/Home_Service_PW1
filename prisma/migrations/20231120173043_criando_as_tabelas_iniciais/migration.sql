-- CreateTable
CREATE TABLE "PrestadorServico" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "endereco" TEXT NOT NULL,
    "foto" TEXT NOT NULL,

    CONSTRAINT "PrestadorServico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anuncio" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" TEXT NOT NULL,
    "servico" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "prestadorId" TEXT NOT NULL,

    CONSTRAINT "Anuncio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PrestadorServico_email_key" ON "PrestadorServico"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Anuncio" ADD CONSTRAINT "Anuncio_prestadorId_fkey" FOREIGN KEY ("prestadorId") REFERENCES "PrestadorServico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
