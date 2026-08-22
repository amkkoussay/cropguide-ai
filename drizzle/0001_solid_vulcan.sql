CREATE TABLE `field_observations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`species` enum('olive','pomegranate','fig','almond','unknown') NOT NULL,
	`imageKey` varchar(512) NOT NULL,
	`imageUrl` varchar(1024) NOT NULL,
	`imageName` varchar(255) NOT NULL,
	`mimeType` varchar(128) NOT NULL,
	`latitude` double,
	`longitude` double,
	`capturedAt` timestamp NOT NULL,
	`apiResponse` json NOT NULL,
	`summary` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `field_observations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `field_observations` ADD CONSTRAINT `field_observations_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `field_observations_user_created_idx` ON `field_observations` (`userId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `field_observations_user_species_idx` ON `field_observations` (`userId`,`species`);