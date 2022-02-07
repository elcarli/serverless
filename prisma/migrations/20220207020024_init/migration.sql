/*
  Warnings:

  - You are about to drop the column `tagetUserId` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `targetUserId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_tagetUserId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "tagetUserId",
ADD COLUMN     "targetUserId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
