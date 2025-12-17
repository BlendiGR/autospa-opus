CREATE EXTENSION IF NOT EXISTS citext;

-- CreateTable
CREATE TABLE "public"."Tyre" (
    "id" SERIAL NOT NULL,
    "number" VARCHAR(20) NOT NULL,
    "plate" CITEXT NOT NULL,
    "location" VARCHAR(50),
    "dateStored" TIMESTAMP(3),

    CONSTRAINT "Tyre_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tyre_plate_key" ON "public"."Tyre"("plate");

-- CreateIndex
CREATE INDEX "Tyre_location_idx" ON "public"."Tyre"("location");

-- CreateIndex
CREATE INDEX "Tyre_dateStored_idx" ON "public"."Tyre"("dateStored");