-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "apelido" TEXT,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "planoContas" TEXT,
    "dataAtual" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Beneficiario" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "dataAtual" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Beneficiario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegMovimentacao" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "id_categoria" INTEGER NOT NULL,
    "id_beneficiario" INTEGER,
    "descricao" TEXT NOT NULL,
    "formaPagamento" TEXT,
    "valor" DOUBLE PRECISION NOT NULL,
    "tipo" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "dataVencimento" TIMESTAMP(3),
    "dataTitulo" TIMESTAMP(3),
    "dataAtual" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegMovimentacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficiario" ADD CONSTRAINT "Beneficiario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegMovimentacao" ADD CONSTRAINT "RegMovimentacao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegMovimentacao" ADD CONSTRAINT "RegMovimentacao_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegMovimentacao" ADD CONSTRAINT "RegMovimentacao_id_beneficiario_fkey" FOREIGN KEY ("id_beneficiario") REFERENCES "Beneficiario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
