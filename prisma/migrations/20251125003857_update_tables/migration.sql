/*
  Warnings:

  - You are about to drop the column `team_id` on the `taskHistory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "taskHistory" DROP CONSTRAINT "taskHistory_team_id_fkey";

-- AlterTable
ALTER TABLE "taskHistory" DROP COLUMN "team_id";
