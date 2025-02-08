CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE TABLE "auth"."users" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
