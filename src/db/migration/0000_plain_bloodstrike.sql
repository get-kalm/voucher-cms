CREATE TABLE "vouchers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vouchers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"code" varchar(8) NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"is_redeemed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone DEFAULT null,
	CONSTRAINT "vouchers_name_unique" UNIQUE("name"),
	CONSTRAINT "vouchers_code_unique" UNIQUE("code")
);
