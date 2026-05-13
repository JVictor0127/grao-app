/*
  Warnings:

  - You are about to drop the column `dataAtual` on the `Beneficiario` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Beneficiario` table. All the data in the column will be lost.
  - You are about to drop the column `dataAtual` on the `Categoria` table. All the data in the column will be lost.
  - You are about to drop the column `planoContas` on the `Categoria` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Categoria` table. All the data in the column will be lost.
  - You are about to drop the column `dataAtual` on the `RegMovimentacao` table. All the data in the column will be lost.
  - You are about to drop the column `id_beneficiario` on the `RegMovimentacao` table. All the data in the column will be lost.
  - You are about to alter the column `valor` on the `RegMovimentacao` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to drop the column `senha_hash` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `senha` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RegMovimentacao" DROP CONSTRAINT "RegMovimentacao_id_beneficiario_fkey";

-- AlterTable
ALTER TABLE "Beneficiario" DROP COLUMN "dataAtual",
DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Categoria" DROP COLUMN "dataAtual",
DROP COLUMN "planoContas",
DROP COLUMN "status";

-- AlterTable
ALTER TABLE "RegMovimentacao" DROP COLUMN "dataAtual",
DROP COLUMN "id_beneficiario",
ADD COLUMN     "beneficiario_id" INTEGER,
ADD COLUMN     "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "valor" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'Pago',
ALTER COLUMN "status" SET DATA TYPE TEXT,
ALTER COLUMN "dataTitulo" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "senha_hash",
ADD COLUMN     "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "senha" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "RegMovimentacao" ADD CONSTRAINT "RegMovimentacao_beneficiario_id_fkey" FOREIGN KEY ("beneficiario_id") REFERENCES "Beneficiario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
