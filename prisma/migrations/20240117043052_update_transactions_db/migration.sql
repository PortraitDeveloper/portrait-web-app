-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "additional_cost" INTEGER DEFAULT 0,
ADD COLUMN     "new_total" INTEGER DEFAULT 0;
