import { integer, pgTable, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export const vouchersTable = pgTable("vouchers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull().unique(),
  code: varchar({ length: 8 }).notNull().unique(),
  isActive: boolean("is_active").notNull().default(false),
  isRedeemed: boolean("is_redeemed").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});
