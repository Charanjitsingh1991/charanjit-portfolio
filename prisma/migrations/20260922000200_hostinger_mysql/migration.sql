CREATE TABLE `Project` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `category` VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `coverImage` TEXT NOT NULL,
  `coverAlt` VARCHAR(191) NOT NULL DEFAULT '',
  `client` VARCHAR(191) NOT NULL DEFAULT '',
  `role` VARCHAR(191) NOT NULL DEFAULT '',
  `challenge` TEXT NOT NULL DEFAULT '',
  `solution` TEXT NOT NULL DEFAULT '',
  `outcome` TEXT NOT NULL DEFAULT '',
  `gallery` JSON NOT NULL,
  `videoUrl` VARCHAR(191) NOT NULL DEFAULT '',
  `documentUrl` VARCHAR(191) NOT NULL DEFAULT '',
  `seoTitle` VARCHAR(191) NOT NULL DEFAULT '',
  `seoDescription` VARCHAR(191) NOT NULL DEFAULT '',
  `socialImage` VARCHAR(191) NOT NULL DEFAULT '',
  `results` TEXT NOT NULL DEFAULT '',
  `deleted` BOOLEAN NOT NULL DEFAULT false,
  `liveUrl` TEXT NULL,
  `repoUrl` TEXT NULL,
  `tech` TEXT NULL,
  `year` VARCHAR(191) NULL,
  `featured` BOOLEAN NOT NULL DEFAULT false,
  `published` BOOLEAN NOT NULL DEFAULT true,
  `order` INTEGER NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `Project_slug_key`(`slug`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Inquiry` (
  `id` VARCHAR(191) NOT NULL,
  `requestId` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `company` VARCHAR(191) NOT NULL,
  `service` VARCHAR(191) NOT NULL,
  `budget` VARCHAR(191) NOT NULL,
  `message` TEXT NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'new',
  `notes` TEXT NOT NULL DEFAULT '',
  `emailStatus` VARCHAR(191) NOT NULL DEFAULT 'pending',
  `confirmationStatus` VARCHAR(191) NOT NULL DEFAULT 'pending',
  `project` VARCHAR(191) NOT NULL DEFAULT '',
  `source` VARCHAR(191) NOT NULL DEFAULT '/contact',
  `followUp` VARCHAR(191) NOT NULL DEFAULT '',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `Inquiry_requestId_key`(`requestId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `RateLimit` (
  `key` VARCHAR(191) NOT NULL,
  `count` INTEGER NOT NULL DEFAULT 0,
  `expiresAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `SiteState` (
  `key` VARCHAR(191) NOT NULL,
  `value` JSON NOT NULL,
  PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
