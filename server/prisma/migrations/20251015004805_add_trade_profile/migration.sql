-- CreateTable
CREATE TABLE "public"."trade_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gstNumber" TEXT,
    "businessType" TEXT,
    "annualTurnover" TEXT,
    "productInterest" TEXT,
    "experience" TEXT,
    "website" TEXT,
    "additionalInfo" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "termsAcceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trade_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trade_profiles_userId_key" ON "public"."trade_profiles"("userId");

-- AddForeignKey
ALTER TABLE "public"."trade_profiles" ADD CONSTRAINT "trade_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
