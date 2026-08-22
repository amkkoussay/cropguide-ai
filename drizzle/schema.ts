import { double, index, int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { fieldSpecies } from "../shared/species";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const orchardSpecies = fieldSpecies;
export type OrchardSpecies = (typeof orchardSpecies)[number];
export const observationStatuses = ["completed"] as const;
export type ObservationStatus = (typeof observationStatuses)[number];

export const fieldObservations = mysqlTable(
  "field_observations",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id),
    visitorId: varchar("visitorId", { length: 96 }).default("").notNull(),
    species: mysqlEnum("species", orchardSpecies).notNull(),
    status: mysqlEnum("status", observationStatuses).default("completed").notNull(),
    imageKey: varchar("imageKey", { length: 512 }).notNull(),
    imageUrl: varchar("imageUrl", { length: 1024 }).notNull(),
    imageName: varchar("imageName", { length: 255 }).notNull(),
    mimeType: varchar("mimeType", { length: 128 }).notNull(),
    latitude: double("latitude"),
    longitude: double("longitude"),
    capturedAt: timestamp("capturedAt").notNull(),
    apiResponse: json("apiResponse").notNull(),
    summary: json("summary").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    userCreatedIndex: index("field_observations_user_created_idx").on(table.userId, table.createdAt),
    userSpeciesIndex: index("field_observations_user_species_idx").on(table.userId, table.species),
    visitorCreatedIndex: index("field_observations_visitor_created_idx").on(table.visitorId, table.createdAt),
    visitorSpeciesIndex: index("field_observations_visitor_species_idx").on(table.visitorId, table.species),
  }),
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type FieldObservation = typeof fieldObservations.$inferSelect;
export type InsertFieldObservation = typeof fieldObservations.$inferInsert;

// TODO: Add your tables here
