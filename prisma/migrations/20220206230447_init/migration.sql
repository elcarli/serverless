/*
  Warnings:

  - You are about to drop the column `is_approved` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "is_approved",
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false;
