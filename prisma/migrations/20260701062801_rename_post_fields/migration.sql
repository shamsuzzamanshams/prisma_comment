/*
  Warnings:

  - You are about to drop the column `isFeatures` on the `posta` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnil` on the `posta` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posta" DROP COLUMN "isFeatures",
DROP COLUMN "thumbnil",
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "thumbnail" TEXT;
