import { sql, relations } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

// Re-export auth table through shared/schema so server code imports from one place
export { users };

// App-level auth types used by storage.ts
export type AppUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============ INKPLAN MODELS ============

// User profiles - extends auth.users with InkPlan-specific data
export const userProfiles = pgTable("user_profiles", {
  userId: varchar("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name"),
  skillLevel: text("skill_level").default("Apprentice"),
  bio: text("bio"),
  subscriptionTier: text("subscription_tier")
    .$type<"free" | "pro" | "premium">()
    .notNull()
    .default("free"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userProfilesRelations = relations(userProfiles, ({ many }) => ({
  drawings: many(drawings),
  progress: many(userProgress),
}));

// Tattoo styles (pre-seeded data)
export const tattooStyles = pgTable("tattoo_styles", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  tags: text("tags").array().notNull(),
  definition: text("definition").notNull(),
  rules: text("rules").array().notNull(),
  commonMistakes: text("common_mistakes").array().notNull(),
  drills: text("drills").notNull(),
  previewImage: text("preview_image").notNull(),
});

export const tattooStylesRelations = relations(tattooStyles, ({ many }) => ({
  drawings: many(drawings),
  progress: many(userProgress),
}));

// User drawings (uploaded practice work)
export const drawings = pgTable(
  "drawings",
  {
    id: varchar("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: varchar("user_id")
      .notNull()
      .references(() => userProfiles.userId, { onDelete: "cascade" }),
    title: text("title").notNull(),
    styleId: varchar("style_id").references(() => tattooStyles.id),
    imageUrl: text("image_url").notNull(),
    notes: text("notes"),
    isPublic: boolean("is_public").default(false),
    isFavorite: boolean("is_favorite").default(false),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("drawings_user_id_idx").on(table.userId),
    index("drawings_style_id_idx").on(table.styleId),
  ],
);

export const drawingsRelations = relations(drawings, ({ one }) => ({
  user: one(userProfiles, {
    fields: [drawings.userId],
    references: [userProfiles.userId],
  }),
  style: one(tattooStyles, {
    fields: [drawings.styleId],
    references: [tattooStyles.id],
  }),
}));

// User progress tracking per style
export const userProgress = pgTable(
  "user_progress",
  {
    id: varchar("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: varchar("user_id")
      .notNull()
      .references(() => userProfiles.userId, { onDelete: "cascade" }),
    styleId: varchar("style_id")
      .notNull()
      .references(() => tattooStyles.id),
    progressPercent: integer("progress_percent").default(0),
    hoursPracticed: integer("hours_practiced").default(0),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    uniqueIndex("progress_user_style_idx").on(table.userId, table.styleId),
  ],
);

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(userProfiles, {
    fields: [userProgress.userId],
    references: [userProfiles.userId],
  }),
  style: one(tattooStyles, {
    fields: [userProgress.styleId],
    references: [tattooStyles.id],
  }),
}));

// ============ ZODS & TYPES ============

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDrawingSchema = createInsertSchema(drawings).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const updateDrawingSchema = insertDrawingSchema.partial();

export const insertProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  updatedAt: true,
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;

export type TattooStyle = typeof tattooStyles.$inferSelect;

export type Drawing = typeof drawings.$inferSelect;
export type InsertDrawing = z.infer<typeof insertDrawingSchema>;
export type UpdateDrawing = z.infer<typeof updateDrawingSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertProgress = z.infer<typeof insertProgressSchema>;
