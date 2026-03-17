import {
  users,
  userProfiles,
  tattooStyles,
  drawings,
  userProgress,
  type AppUser,
  type InsertUser,
  type UserProfile,
  type InsertUserProfile,
  type TattooStyle,
  type Drawing,
  type InsertDrawing,
  type UpdateDrawing,
  type UserProgress,
  type InsertProgress,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

type ProgressUpdateInput = Omit<InsertProgress, "userId">;

export interface IStorage {
  // Users
  getUserById(id: string): Promise<AppUser | undefined>;
  getUserByEmail(email: string): Promise<AppUser | undefined>;
  createUser(data: InsertUser): Promise<AppUser>;

  // User profiles
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(
    userId: string,
    data: InsertUserProfile,
  ): Promise<UserProfile>;
  updateUserProfile(
    userId: string,
    data: Partial<InsertUserProfile>,
  ): Promise<UserProfile | undefined>;

  // Tattoo styles
  getAllStyles(): Promise<TattooStyle[]>;
  getStyleById(id: string): Promise<TattooStyle | undefined>;
  seedStyles(styles: TattooStyle[]): Promise<void>;

  // Drawings
  getUserDrawings(userId: string): Promise<Drawing[]>;
  getDrawingById(id: string, userId: string): Promise<Drawing | undefined>;
  createDrawing(userId: string, data: InsertDrawing): Promise<Drawing>;
  updateDrawing(
    id: string,
    userId: string,
    data: UpdateDrawing,
  ): Promise<Drawing | undefined>;
  deleteDrawing(id: string, userId: string): Promise<void>;
  getDrawingCount(userId: string): Promise<number>;

  // Progress
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getProgressByStyle(
    userId: string,
    styleId: string,
  ): Promise<UserProgress | undefined>;
  upsertProgress(
    userId: string,
    data: ProgressUpdateInput,
  ): Promise<UserProgress>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUserById(id: string): Promise<AppUser | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<AppUser | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));

    return user;
  }

  async createUser(data: InsertUser): Promise<AppUser> {
    if (!data.email) {
      throw new Error("Email is required to create a user");
    }

    const [user] = await db
      .insert(users)
      .values({
        ...data,
        email: data.email.toLowerCase(),
      })
      .returning();

    return user;
  }

  // User profiles
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));

    return profile;
  }

  async createUserProfile(
    userId: string,
    data: InsertUserProfile,
  ): Promise<UserProfile> {
    const [profile] = await db
      .insert(userProfiles)
      .values({
        ...data,
        userId,
      })
      .returning();

    return profile;
  }

  async updateUserProfile(
    userId: string,
    data: Partial<InsertUserProfile>,
  ): Promise<UserProfile | undefined> {
    const [profile] = await db
      .update(userProfiles)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, userId))
      .returning();

    return profile;
  }

  // Tattoo styles
  async getAllStyles(): Promise<TattooStyle[]> {
    return await db.select().from(tattooStyles);
  }

  async getStyleById(id: string): Promise<TattooStyle | undefined> {
    const [style] = await db
      .select()
      .from(tattooStyles)
      .where(eq(tattooStyles.id, id));

    return style;
  }

  async seedStyles(styles: TattooStyle[]): Promise<void> {
    for (const style of styles) {
      await db.insert(tattooStyles).values(style).onConflictDoNothing();
    }
  }

  // Drawings
  async getUserDrawings(userId: string): Promise<Drawing[]> {
    return await db
      .select()
      .from(drawings)
      .where(eq(drawings.userId, userId))
      .orderBy(desc(drawings.createdAt));
  }

  async getDrawingById(id: string, userId: string): Promise<Drawing | undefined> {
    const [drawing] = await db
      .select()
      .from(drawings)
      .where(and(eq(drawings.id, id), eq(drawings.userId, userId)));

    return drawing;
  }

  async createDrawing(userId: string, data: InsertDrawing): Promise<Drawing> {
    const [drawing] = await db
      .insert(drawings)
      .values({
        ...data,
        userId,
      })
      .returning();

    return drawing;
  }

  async updateDrawing(
    id: string,
    userId: string,
    data: UpdateDrawing,
  ): Promise<Drawing | undefined> {
    const [drawing] = await db
      .update(drawings)
      .set({
        ...data,
      })
      .where(and(eq(drawings.id, id), eq(drawings.userId, userId)))
      .returning();

    return drawing;
  }

  async deleteDrawing(id: string, userId: string): Promise<void> {
    await db
      .delete(drawings)
      .where(and(eq(drawings.id, id), eq(drawings.userId, userId)));
  }

  async getDrawingCount(userId: string): Promise<number> {
    const result = await db
      .select()
      .from(drawings)
      .where(eq(drawings.userId, userId));

    return result.length;
  }

  // Progress
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));
  }

  async getProgressByStyle(
    userId: string,
    styleId: string,
  ): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(
        and(eq(userProgress.userId, userId), eq(userProgress.styleId, styleId)),
      );

    return progress;
  }

  async upsertProgress(
    userId: string,
    data: ProgressUpdateInput,
  ): Promise<UserProgress> {
    const [progress] = await db
      .insert(userProgress)
      .values({
        ...data,
        userId,
      })
      .onConflictDoUpdate({
        target: [userProgress.userId, userProgress.styleId],
        set: {
          progressPercent: data.progressPercent,
          hoursPracticed: data.hoursPracticed,
          updatedAt: new Date(),
        },
      })
      .returning();

    return progress;
  }
}

export const storage = new DatabaseStorage();