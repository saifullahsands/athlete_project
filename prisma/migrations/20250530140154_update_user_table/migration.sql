-- DropForeignKey
ALTER TABLE `otp` DROP FOREIGN KEY `Otp_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Otp` ADD CONSTRAINT `Otp_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
