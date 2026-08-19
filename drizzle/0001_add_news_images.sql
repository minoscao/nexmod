ALTER TABLE `news_items` ADD `image_url` text DEFAULT '' NOT NULL;
--> statement-breakpoint
CREATE TABLE `news_media` (
	`id` text PRIMARY KEY NOT NULL,
	`content_type` text NOT NULL,
	`content` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
