/*
  Warnings:

  - You are about to drop the column `demandlevel` on the `IndustryInsight` table. All the data in the column will be lost.
  - You are about to drop the `Coverletter` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `demandLevel` to the `IndustryInsight` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `marketOutLook` on the `IndustryInsight` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MarketOutlook" AS ENUM ('POSITIVE', 'NEUTRAL', 'NEGATIVE');

-- DropForeignKey
ALTER TABLE "Coverletter" DROP CONSTRAINT "Coverletter_userId_fkey";

-- AlterTable
ALTER TABLE "IndustryInsight" DROP COLUMN "demandlevel",
ADD COLUMN     "demandLevel" "DemandLevel" NOT NULL,
DROP COLUMN "marketOutLook",
ADD COLUMN     "marketOutLook" "MarketOutlook" NOT NULL;

-- DropTable
DROP TABLE "Coverletter";

-- DropEnum
DROP TYPE "MarketOutLook";

-- CreateTable
CREATE TABLE "CoverLetter" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "jobDescription" TEXT,
    "companyName" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoverLetter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CoverLetter_userId_idx" ON "CoverLetter"("userId");

-- AddForeignKey
ALTER TABLE "CoverLetter" ADD CONSTRAINT "CoverLetter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
