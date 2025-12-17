-- AlterTable
ALTER TABLE "Tyre" ADD COLUMN     "customerId" INTEGER;

-- CreateTable
CREATE TABLE "Invoices" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "plate" CITEXT NOT NULL,
    "services" TEXT[],
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "totalTax" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "plate" CITEXT,
    "name" TEXT NOT NULL,
    "company" TEXT,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Invoices_customerId_idx" ON "Invoices"("customerId");

-- CreateIndex
CREATE INDEX "Invoices_plate_idx" ON "Invoices"("plate");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE INDEX "Customer_email_idx" ON "Customer"("email");

-- CreateIndex
CREATE INDEX "Customer_phone_idx" ON "Customer"("phone");

-- CreateIndex
CREATE INDEX "Customer_plate_idx" ON "Customer"("plate");

-- AddForeignKey
ALTER TABLE "Tyre" ADD CONSTRAINT "Tyre_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
