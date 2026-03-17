import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import {
  insertUserProfileSchema,
  insertDrawingSchema,
  updateDrawingSchema,
  insertProgressSchema,
} from "@shared/schema";

type DevUser = {
  claims: {
    sub: string | string[];
    email?: string | string[];
    first_name?: string | string[];
  };
};

type RegisterBody = {
  email?: string;
  password?: string;
};

type LoginBody = {
  email?: string;
  password?: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: DevUser;
    }
  }
}

function toSingleString(
  value: string | string[] | undefined,
  fallback = "",
): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return value[0];
  return fallback;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function toSafeUser(user: any) {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt ?? user.created_at ?? null,
  };
}

function isAuthenticated(req: Request, _res: Response, next: NextFunction) {
  req.user = {
    claims: {
      sub: "dev-user-123",
      email: "dev@inkplan.com",
      first_name: "Isaac",
    },
  };

  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // ============ AUTH ============

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body as RegisterBody;

      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required",
        });
      }

      const normalizedEmail = normalizeEmail(email);

      if (!isValidEmail(normalizedEmail)) {
        return res.status(400).json({
          message: "Please enter a valid email address",
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          message: "Password must be at least 8 characters",
        });
      }

      const existingUser = await storage.getUserByEmail(normalizedEmail);

      if (existingUser) {
        return res.status(409).json({
          message: "An account with this email already exists",
        });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await storage.createUser({
        email: normalizedEmail,
        passwordHash,
      });

      await storage.createUserProfile(user.id, {
        displayName: normalizedEmail.split("@")[0],
        skillLevel: "Apprentice",
        planId: "free",
      });

      return res.status(201).json({
        message: "User registered successfully",
        user: toSafeUser(user),
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body as LoginBody;

      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required",
        });
      }

      const normalizedEmail = normalizeEmail(email);

      if (!isValidEmail(normalizedEmail)) {
        return res.status(400).json({
          message: "Please enter a valid email address",
        });
      }

      const user = await storage.getUserByEmail(normalizedEmail);

      if (!user) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      return res.status(200).json({
        message: "Login successful",
        user: toSafeUser(user),
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  });

  // ============ USER PROFILES ============

  app.get("/api/profile", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = toSingleString(req.user?.claims?.sub);

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      let profile = await storage.getUserProfile(userId);

      if (!profile) {
        const displayName =
          toSingleString(req.user?.claims?.first_name) ||
          toSingleString(req.user?.claims?.email) ||
          "Artist";

        profile = await storage.createUserProfile(userId, {
          displayName,
          skillLevel: "Apprentice",
          planId: "free",
        });
      }

      return res.json(profile);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/profile", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = toSingleString(req.user?.claims?.sub);

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const data = insertUserProfileSchema.partial().parse(req.body);
      const profile = await storage.updateUserProfile(userId, data);

      return res.json(profile);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  // ============ TATTOO STYLES ============

  app.get("/api/styles", isAuthenticated, async (_req: Request, res: Response) => {
    try {
      const styles = await storage.getAllStyles();
      return res.json(styles);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/styles/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const styleId = toSingleString(req.params.id);

      if (!styleId) {
        return res.status(400).json({ message: "Style id is required" });
      }

      const style = await storage.getStyleById(styleId);

      if (!style) {
        return res.status(404).json({ message: "Style not found" });
      }

      return res.json(style);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // ============ DRAWINGS ============

  app.get("/api/drawings", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = toSingleString(req.user?.claims?.sub);

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const drawings = await storage.getUserDrawings(userId);
      return res.json(drawings);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/drawings/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = toSingleString(req.user?.claims?.sub);
      const drawingId = toSingleString(req.params.id);

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!drawingId) {
        return res.status(400).json({ message: "Drawing id is required" });
      }

      const drawing = await storage.getDrawingById(drawingId);

      if (!drawing) {
        return res.status(404).json({ message: "Drawing not found" });
      }

      if (drawing.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      return res.json(drawing);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/drawings", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = toSingleString(req.user?.claims?.sub);

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const data = insertDrawingSchema.parse(req.body);
      const drawing = await storage.createDrawing(userId, data);

      return res.status(201).json(drawing);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/drawings/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = toSingleString(req.user?.claims?.sub);
      const drawingId = toSingleString(req.params.id);

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!drawingId) {
        return res.status(400).json({ message: "Drawing id is required" });
      }

      const data = updateDrawingSchema.parse(req.body);
      const drawing = await storage.updateDrawing(drawingId, userId, data);

      if (!drawing) {
        return res
          .status(404)
          .json({ message: "Drawing not found or unauthorized" });
      }

      return res.json(drawing);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/drawings/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = toSingleString(req.user?.claims?.sub);
      const drawingId = toSingleString(req.params.id);

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!drawingId) {
        return res.status(400).json({ message: "Drawing id is required" });
      }

      await storage.deleteDrawing(drawingId, userId);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // ============ PROGRESS ============

  app.get("/api/progress", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = toSingleString(req.user?.claims?.sub);

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const progress = await storage.getUserProgress(userId);
      return res.json(progress);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/progress", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = toSingleString(req.user?.claims?.sub);

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const data = insertProgressSchema.parse({ ...req.body, userId });
      const progress = await storage.upsertProgress(data);

      return res.json(progress);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  return httpServer;
}