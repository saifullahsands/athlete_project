/*
  Warnings:

  - You are about to drop the column `userId` on the `otp` table. All the data in the column will be lost.
  - Added the required column `email` to the `Otp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `otp` DROP FOREIGN KEY `Otp_userId_fkey`;

-- DropIndex
DROP INDEX `Otp_userId_key` ON `otp`;

-- AlterTable
ALTER TABLE `otp` DROP COLUMN `userId`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `otp_type` ENUM('SIGNUP_VERIFICATION', 'RESET_PASSWORD') NOT NULL DEFAULT 'SIGNUP_VERIFICATION';

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('ATHELETE', 'COACH') NOT NULL;
