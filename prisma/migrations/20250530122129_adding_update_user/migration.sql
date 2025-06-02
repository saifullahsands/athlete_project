/*
  Warnings:

  - You are about to drop the column `email` on the `otp` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expireAt` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Otp_email_key` ON `otp`;

-- AlterTable
ALTER TABLE `otp` DROP COLUMN `email`,
    ADD COLUMN `expireAt` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);
