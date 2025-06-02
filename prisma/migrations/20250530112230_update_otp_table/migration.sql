/*
  Warnings:

  - You are about to alter the column `code` on the `otp` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - A unique constraint covering the columns `[email]` on the table `Otp` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Otp` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User_email_key` ON `user`;

-- AlterTable
ALTER TABLE `otp` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    MODIFY `code` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Otp_email_key` ON `Otp`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `Otp_userId_key` ON `Otp`(`userId`);
