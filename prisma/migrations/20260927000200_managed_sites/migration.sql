CREATE TABLE `ManagedSite` (
  `id` VARCHAR(191) NOT NULL, `clientName` VARCHAR(191) NOT NULL, `label` VARCHAR(191) NOT NULL,
  `url` TEXT NOT NULL, `domainProvider` VARCHAR(191) NOT NULL DEFAULT '', `domainRenewal` DATETIME(3) NULL,
  `serverProvider` VARCHAR(191) NOT NULL DEFAULT '', `serverRenewal` DATETIME(3) NULL,
  `contactEmail` VARCHAR(191) NOT NULL DEFAULT '', `notes` TEXT NOT NULL DEFAULT '', `active` BOOLEAN NOT NULL DEFAULT true,
  `lastStatus` INTEGER NULL, `lastResponseMs` INTEGER NULL, `lastPerformance` INTEGER NULL, `lastSeo` INTEGER NULL,
  `lastAccessibility` INTEGER NULL, `lastBestPractices` INTEGER NULL, `lastCheckedAt` DATETIME(3) NULL,
  `reminderLog` JSON NOT NULL, `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `SiteAudit` (
  `id` VARCHAR(191) NOT NULL, `managedSiteId` VARCHAR(191) NOT NULL, `status` INTEGER NULL, `responseMs` INTEGER NULL,
  `performance` INTEGER NULL, `seo` INTEGER NULL, `accessibility` INTEGER NULL, `bestPractices` INTEGER NULL,
  `issues` JSON NOT NULL, `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `SiteAudit_managedSiteId_createdAt_idx`(`managedSiteId`, `createdAt`), PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `SiteAudit` ADD CONSTRAINT `SiteAudit_managedSiteId_fkey` FOREIGN KEY (`managedSiteId`) REFERENCES `ManagedSite`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
