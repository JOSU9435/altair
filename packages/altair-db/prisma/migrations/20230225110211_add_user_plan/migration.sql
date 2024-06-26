-- AlterTable
ALTER TABLE "PlanConfig" ADD COLUMN     "allowMoreTeamMembers" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stripeProductId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stripeCustomerId" TEXT;

-- CreateTable
CREATE TABLE "UserPlan" (
    "userId" TEXT NOT NULL,
    "planRole" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPlan_userId_key" ON "UserPlan"("userId");

-- AddForeignKey
ALTER TABLE "UserPlan" ADD CONSTRAINT "UserPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPlan" ADD CONSTRAINT "UserPlan_planRole_fkey" FOREIGN KEY ("planRole") REFERENCES "PlanConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
