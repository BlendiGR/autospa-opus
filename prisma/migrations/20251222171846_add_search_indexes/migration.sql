-- DropIndex
DROP INDEX "Tyre_dateStored_idx";

-- AlterTable
ALTER TABLE "Tyre" ADD COLUMN     "isStored" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Customer_company_idx" ON "Customer"("company");

-- CreateIndex
CREATE INDEX "Tyre_isStored_idx" ON "Tyre"("isStored");

-- CreateIndex
CREATE INDEX "Tyre_plate_idx" ON "Tyre"("plate");

-- CreateIndex
CREATE INDEX "Tyre_number_idx" ON "Tyre"("number");
