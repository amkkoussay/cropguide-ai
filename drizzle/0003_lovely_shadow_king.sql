ALTER TABLE `field_observations` ADD `visitorId` varchar(96) DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE INDEX `field_observations_visitor_created_idx` ON `field_observations` (`visitorId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `field_observations_visitor_species_idx` ON `field_observations` (`visitorId`,`species`);