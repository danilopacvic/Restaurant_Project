/*
  Warnings:

  - You are about to drop the column `menuCategoryid` on the `Product` table. All the data in the column will be lost.
  - Added the required column `menuCategoryId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_menuCategoryid_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "menuCategoryid",
ADD COLUMN     "menuCategoryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_menuCategoryId_fkey" FOREIGN KEY ("menuCategoryId") REFERENCES "MenuCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
