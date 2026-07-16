import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  json,
  boolean,
  bigint,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  plan: mysqlEnum("plan", ["starter", "pro", "enterprise"]).default("starter").notNull(),
  metadata: json("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const savedAreas = mysqlTable("saved_areas", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  county: varchar("county", { length: 255 }).notNull(),
  state: varchar("state", { length: 10 }).notNull(),
  lat: varchar("lat", { length: 20 }),
  lng: varchar("lng", { length: 20 }),
  alertEnabled: boolean("alertEnabled").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SavedArea = typeof savedAreas.$inferSelect;

export const notifications = mysqlTable("notifications", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  type: mysqlEnum("type", ["alert", "recommendation", "growth_story", "system", "billing"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  link: varchar("link", { length: 500 }),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;

export const feedback = mysqlTable("feedback", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  type: mysqlEnum("type", ["general", "bug", "feature_request", "data_issue", "praise", "county_request", "other"]).notNull(),
  message: text("message").notNull(),
  rating: int("rating"),
  page: varchar("page", { length: 100 }),
  resolved: boolean("resolved").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Feedback = typeof feedback.$inferSelect;

export const subscriptionEvents = mysqlTable("subscription_events", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  event: mysqlEnum("event", ["trial_started", "trial_expired", "subscribed", "upgraded", "downgraded", "cancelled", "payment_failed", "payment_succeeded"]).notNull(),
  plan: mysqlEnum("plan", ["starter", "pro", "enterprise"]).notNull(),
  amount: int("amount"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SubscriptionEvent = typeof subscriptionEvents.$inferSelect;

export const mapMarkers = mysqlTable("map_markers", {
  id: serial("id").primaryKey(),
  type: mysqlEnum("type", ["project", "permit", "zoning", "utility", "hotspot"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  county: varchar("county", { length: 255 }).notNull(),
  state: varchar("state", { length: 10 }).notNull(),
  lat: varchar("lat", { length: 20 }).notNull(),
  lng: varchar("lng", { length: 20 }).notNull(),
  score: int("score").default(0).notNull(),
  confidence: int("confidence").default(0).notNull(),
  status: varchar("status", { length: 50 }),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type MapMarker = typeof mapMarkers.$inferSelect;
