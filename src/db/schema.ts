import {
  integer,
  pgTable,
  varchar,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const vouchersTable = pgTable("vouchers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull().unique(),
  code: varchar({ length: 8 }).notNull().unique(),
  isActive: boolean("is_active").notNull().default(false),
  isRedeemed: boolean("is_redeemed").notNull().default(false),
  expiryDate: timestamp("expiry_date", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const accessTokensTable = pgTable("access_tokens", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userID: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  token: varchar({ length: 255 }).notNull(),
  expiredAt: timestamp("expired_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});
