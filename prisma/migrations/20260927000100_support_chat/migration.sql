CREATE TABLE `SupportConversation` (
  `id` VARCHAR(191) NOT NULL,
  `visitorTokenHash` VARCHAR(191) NOT NULL,
  `firstName` VARCHAR(191) NOT NULL,
  `lastName` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'open',
  `unreadAdmin` INTEGER NOT NULL DEFAULT 0,
  `unreadVisitor` INTEGER NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `SupportConversation_visitorTokenHash_key`(`visitorTokenHash`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `SupportMessage` (
  `id` VARCHAR(191) NOT NULL,
  `conversationId` VARCHAR(191) NOT NULL,
  `sender` VARCHAR(191) NOT NULL,
  `body` TEXT NOT NULL,
  `emailStatus` VARCHAR(191) NOT NULL DEFAULT 'not-required',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `SupportMessage_conversationId_createdAt_idx`(`conversationId`, `createdAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `SupportMessage` ADD CONSTRAINT `SupportMessage_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `SupportConversation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;