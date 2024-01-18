/*
  Warnings:

  - You are about to drop the column `additional_cost` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `new_total` on the `transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "additional_cost",
DROP COLUMN "new_total",
ADD COLUMN     "prev_total" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "price_diff" INTEGER NOT NULL DEFAULT 0;
