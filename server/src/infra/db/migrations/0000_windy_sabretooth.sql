CREATE TABLE "short_urls" (
	"id" text PRIMARY KEY NOT NULL,
	"original_url" text NOT NULL,
	"short_code" varchar(32) NOT NULL,
	"access_count" bigint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "short_urls_short_code_unique" UNIQUE("short_code")
);
