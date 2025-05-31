/*
  Warnings:

  - You are about to drop the column `emotion` on the `Recipe` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Recipe_emotion_idx` ON `Recipe`;

-- AlterTable
ALTER TABLE `Recipe` DROP COLUMN `emotion`;

-- CreateTable
CREATE TABLE `RecipeEmotion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipeId` INTEGER NOT NULL,
    `emotion` ENUM('SAD', 'LONELY', 'CONFUSED', 'HAPPY', 'HOPEFUL', 'EMPTY', 'ANGRY', 'CALM', 'GRATEFUL', 'NOSTALGIC') NOT NULL,

    UNIQUE INDEX `RecipeEmotion_recipeId_emotion_key`(`recipeId`, `emotion`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RecipeEmotion` ADD CONSTRAINT `RecipeEmotion_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
