import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { requireAuth } from "./middleware/requireAuth";
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

type SessionRequest = Request & {
  session?: {
    userId?: string;
  };
  user?: DevUser;
  userId?: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: DevUser;
      userId?: string;
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

function toSafeUser(user: {
  id: string;
  email: string;
  createdAt?: Date | string | null;
}) {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt ?? null,
  };
}

function isAuthenticated(req: Request, _res: Response, next: NextFunction) {
  const request = req as SessionRequest;

  if (request.session?.userId) {
    request.userId = request.session.userId;
    return next();
  }

  request.user = {
    claims: {
      sub: "dev-user-123",
      email: "dev@inkplan.com",
      first_name: "Isaac",
    },
  };

  request.userId = toSingleString(request.user.claims.sub);
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // ============ AUTH ============

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    const request = req as SessionRequest;

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

      if (request.session) {
        request.session.userId = user.id;
      }

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
    const request = req as SessionRequest;

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

      if (request.session) {
        request.session.userId = user.id;
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

  app.post("/api/auth/logout", async (req: Request, res: Response) => {
    const request = req as SessionRequest;

    if (!request.session) {
      return res.status(200).json({ message: "Logout successful" });
    }

    request.session.destroy((destroyError) => {
      if (destroyError) {
        return res.status(500).json({
          message: "Failed to log out",
        });
      }

      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    const request = req as SessionRequest;

    try {
      const sessionUserId = request.session?.userId;

      if (!sessionUserId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUserById(sessionUserId);

      if (!user) {
        if (request.session) {
          request.session.userId = undefined;
        }

        return res.status(401).json({ message: "Not authenticated" });
      }

      return res.status(200).json({
        user: toSafeUser(user),
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  });

  // ============ USER PROFILES ============

  app.get(
    "/api/profile",
    requireAuth,
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = req.userId;

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
    },
  );

  app.patch(
    "/api/profile",
    requireAuth,
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = req.userId;

        if (!userId) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const data = insertUserProfileSchema.partial().parse(req.body);
        const profile = await storage.updateUserProfile(userId, data);

        return res.json(profile);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    },
  );

  // ============ TATTOO STYLES ============

  app.get(
    "/api/styles",
    isAuthenticated,
    async (_req: Request, res: Response) => {
      try {
        const styles = await storage.getAllStyles();
        return res.json(styles);
      } catch (error: any) {
        return res.status(500).json({ message: error.message });
      }
    },
  );

  app.get(
    "/api/styles/:id",
    isAuthenticated,
    async (req: Request, res: Response) => {
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
    },
  );

  // ============ DRAWINGS ============

  app.get(
    "/api/drawings",
    requireAuth,
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = req.userId;

        if (!userId) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const drawings = await storage.getUserDrawings(userId);
        return res.json(drawings);
      } catch (error: any) {
        return res.status(500).json({ message: error.message });
      }
    },
  );

  app.get(
    "/api/drawings/:id",
    requireAuth,
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = req.userId;
        const drawingId = toSingleString(req.params.id);

        if (!userId) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        if (!drawingId) {
          return res.status(400).json({ message: "Drawing id is required" });
        }

        const drawing = await storage.getDrawingById(drawingId, userId);

        if (!drawing) {
          return res.status(404).json({ message: "Drawing not found" });
        }

        return res.json(drawing);
      } catch (error: any) {
        return res.status(500).json({ message: error.message });
      }
    },
  );

  app.post(
    "/api/drawings",
    requireAuth,
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = req.userId;

        if (!userId) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const data = insertDrawingSchema.parse(req.body);
        const drawing = await storage.createDrawing(userId, data);

        return res.status(201).json(drawing);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    },
  );

  app.patch(
    "/api/drawings/:id",
    requireAuth,
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = req.userId;
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
    },
  );

  app.delete(
    "/api/drawings/:id",
    requireAuth,
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = req.userId;
        const drawingId = toSingleString(req.params.id);

        if (!userId) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        if (!drawingId) {
          return res.status(400).json({ message: "Drawing id is required" });
        }

        const existingDrawing = await storage.getDrawingById(drawingId, userId);

        if (!existingDrawing) {
          return res.status(404).json({ message: "Drawing not found" });
        }

        await storage.deleteDrawing(drawingId, userId);
        return res.status(204).send();
      } catch (error: any) {
        return res.status(500).json({ message: error.message });
      }
    },
  );

  // ============ PROGRESS ============

  app.get(
    "/api/progress",
    requireAuth,
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = req.userId;

        if (!userId) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const progress = await storage.getUserProgress(userId);
        return res.json(progress);
      } catch (error: any) {
        return res.status(500).json({ message: error.message });
      }
    },
  );

  app.post(
    "/api/progress",
    requireAuth,
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const userId = req.userId;

        if (!userId) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const parsed = insertProgressSchema
          .omit({ userId: true })
          .parse(req.body);

        const progress = await storage.upsertProgress(userId, parsed);

        return res.json(progress);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    },
  );

  return httpServer;
}