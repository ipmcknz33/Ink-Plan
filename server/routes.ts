import type { Express, Request, Response } from "express";
import bcrypt from "bcryptjs";
import type session from "express-session";
import { storage } from "./storage";
import { adminAuth } from "./firebaseAdmin";
import { requireAuth } from "./middleware/requireAuth";
import type { AuthenticatedRequest } from "./middleware/requireAuth";
import {
  insertUserProfileSchema,
  insertDrawingSchema,
  updateDrawingSchema,
  insertProgressSchema,
} from "@shared/schema";

type SessionWithUser = session.Session & {
  userId?: string;
};

type RequestWithSession = Request & {
  session: SessionWithUser;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

function toSafeUser(user: any) {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
  };
}

function getRouteParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

async function ensureUserProfile(userId: string) {
  const existingProfile = await storage.getUserProfile(userId);

  if (existingProfile) {
    return existingProfile;
  }

  return storage.createUserProfile(userId, {});
}

export function registerRoutes(app: Express) {
  // =========================
  // AUTH
  // =========================

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    const request = req as RequestWithSession;

    try {
      const { email, password } = request.body as {
        email?: string;
        password?: string;
      };

      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      const normalizedEmail = normalizeEmail(email);

      if (!isValidEmail(normalizedEmail)) {
        res.status(400).json({ error: "Invalid email address" });
        return;
      }

      if (password.length < 6) {
        res
          .status(400)
          .json({ error: "Password must be at least 6 characters" });
        return;
      }

      const existingUser = await storage.getUserByEmail(normalizedEmail);

      if (existingUser) {
        res.status(409).json({ error: "Email already in use" });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await storage.createUser({
        email: normalizedEmail,
        passwordHash,
      });

      await ensureUserProfile(user.id);

      request.session.userId = user.id;

      request.session.save((err) => {
        if (err) {
          console.error("Register session save error:", err);
          res.status(500).json({ error: "Failed to save session" });
          return;
        }

        res.json(toSafeUser(user));
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ error: "Register failed" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const request = req as RequestWithSession;

    try {
      const { email, password } = request.body as {
        email?: string;
        password?: string;
      };

      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      const normalizedEmail = normalizeEmail(email);
      const user = await storage.getUserByEmail(normalizedEmail);

      if (!user || !user.passwordHash) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);

      if (!isMatch) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      await ensureUserProfile(user.id);

      request.session.userId = user.id;

      request.session.save((err) => {
        if (err) {
          console.error("Login session save error:", err);
          res.status(500).json({ error: "Failed to save session" });
          return;
        }

        res.json(toSafeUser(user));
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/guest", async (req: Request, res: Response) => {
    const request = req as RequestWithSession;

    try {
      const guestEmail = `guest-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}@guest.local`;

      const user = await storage.createUser({
        email: guestEmail,
        passwordHash: "guest-account",
      });

      await ensureUserProfile(user.id);

      request.session.userId = user.id;

      request.session.save((err) => {
        if (err) {
          console.error("Guest session save error:", err);
          res.status(500).json({
            error: "Failed to save guest session",
            details: err.message,
          });
          return;
        }

        console.log("Guest login success:", user.id, user.email);
        res.json(toSafeUser(user));
      });
    } catch (error) {
      console.error("Guest login FULL ERROR:", error);

      const message =
        error instanceof Error ? error.message : "Unknown guest login error";

      res.status(500).json({
        error: "Guest login failed",
        details: message,
      });
    }
  });

  app.post("/api/auth/google", async (req: Request, res: Response) => {
    const request = req as RequestWithSession;

    try {
      const { idToken } = request.body as { idToken?: string };

      if (!idToken) {
        res.status(400).json({ error: "Missing Google token" });
        return;
      }

      const decoded = await adminAuth.verifyIdToken(idToken);
      const email = normalizeEmail(decoded.email || "");

      if (!email) {
        res.status(400).json({ error: "Google account email not available" });
        return;
      }

      let user = await storage.getUserByEmail(email);

      if (!user) {
        user = await storage.createUser({
          email,
          passwordHash: "google-auth-account",
        });
      }

      await ensureUserProfile(user.id);

      request.session.userId = user.id;

      request.session.save((err) => {
        if (err) {
          console.error("Google session save error:", err);
          res.status(500).json({ error: "Failed to save session" });
          return;
        }

        res.json(toSafeUser(user));
      });
    } catch (error) {
      console.error("Google auth error:", error);
      res.status(401).json({ error: "Google login failed" });
    }
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    const request = req as RequestWithSession;

    try {
      if (!request.session.userId) {
        res.status(200).json(null);
        return;
      }

      const user = await storage.getUserById(request.session.userId);

      if (!user) {
        res.status(200).json(null);
        return;
      }

      res.json(toSafeUser(user));
    } catch (error) {
      console.error("Me route error:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    const request = req as RequestWithSession;

    request.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        res.status(500).json({ error: "Logout failed" });
        return;
      }

      res.clearCookie("inkplan.sid");
      res.json({ success: true });
    });
  });

  // =========================
  // PROFILE
  // =========================

  app.get("/api/profile", requireAuth, async (req: Request, res: Response) => {
    const request = req as AuthenticatedRequest;

    try {
      const profile = await ensureUserProfile(request.userId);
      res.json(profile);
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.patch(
    "/api/profile",
    requireAuth,
    async (req: Request, res: Response) => {
      const request = req as AuthenticatedRequest;

      try {
        const parsed = insertUserProfileSchema
          .partial()
          .safeParse(request.body);

        if (!parsed.success) {
          res.status(400).json({ error: "Invalid profile data" });
          return;
        }

        const safeData = {
          displayName: parsed.data.displayName,
          skillLevel: parsed.data.skillLevel,
          bio: parsed.data.bio,
        };

        await ensureUserProfile(request.userId);
        const updated = await storage.updateUserProfile(
          request.userId,
          safeData,
        );

        res.json(updated);
      } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ error: "Failed to update profile" });
      }
    },
  );

  // =========================
  // STYLES
  // =========================

  app.get("/api/styles", async (_req: Request, res: Response) => {
    try {
      const styles = await storage.getAllStyles();
      res.json(styles);
    } catch (error) {
      console.error("Get styles error:", error);
      res.status(500).json({ error: "Failed to fetch styles" });
    }
  });

  app.get("/api/styles/:id", async (req: Request, res: Response) => {
    try {
      const styleId = getRouteParam(req.params.id);
      const style = await storage.getStyleById(styleId);

      if (!style) {
        res.status(404).json({ error: "Style not found" });
        return;
      }

      res.json(style);
    } catch (error) {
      console.error("Get style error:", error);
      res.status(500).json({ error: "Failed to fetch style" });
    }
  });

  // =========================
  // DRAWINGS
  // =========================

  app.get("/api/drawings", requireAuth, async (req: Request, res: Response) => {
    const request = req as AuthenticatedRequest;

    try {
      const drawings = await storage.getUserDrawings(request.userId);
      res.json(drawings);
    } catch (error) {
      console.error("Get drawings error:", error);
      res.status(500).json({ error: "Failed to fetch drawings" });
    }
  });

  app.get(
    "/api/drawings/:id",
    requireAuth,
    async (req: Request, res: Response) => {
      const request = req as AuthenticatedRequest;

      try {
        const drawingId = getRouteParam(req.params.id);
        const drawing = await storage.getDrawingById(drawingId, request.userId);

        if (!drawing) {
          res.status(404).json({ error: "Drawing not found" });
          return;
        }

        res.json(drawing);
      } catch (error) {
        console.error("Get drawing error:", error);
        res.status(500).json({ error: "Failed to fetch drawing" });
      }
    },
  );

  app.post(
    "/api/drawings",
    requireAuth,
    async (req: Request, res: Response) => {
      const request = req as AuthenticatedRequest;

      try {
        const parsed = insertDrawingSchema.safeParse(request.body);

        if (!parsed.success) {
          res.status(400).json({ error: "Invalid drawing data" });
          return;
        }

        const drawing = await storage.createDrawing(
          request.userId,
          parsed.data,
        );
        res.status(201).json(drawing);
      } catch (error) {
        console.error("Create drawing error:", error);
        res.status(500).json({ error: "Failed to create drawing" });
      }
    },
  );

  app.patch(
    "/api/drawings/:id",
    requireAuth,
    async (req: Request, res: Response) => {
      const request = req as AuthenticatedRequest;

      try {
        const drawingId = getRouteParam(req.params.id);
        const parsed = updateDrawingSchema.safeParse(request.body);

        if (!parsed.success) {
          res.status(400).json({ error: "Invalid drawing update" });
          return;
        }

        const updated = await storage.updateDrawing(
          drawingId,
          request.userId,
          parsed.data,
        );

        if (!updated) {
          res.status(404).json({ error: "Drawing not found" });
          return;
        }

        res.json(updated);
      } catch (error) {
        console.error("Update drawing error:", error);
        res.status(500).json({ error: "Failed to update drawing" });
      }
    },
  );

  app.delete(
    "/api/drawings/:id",
    requireAuth,
    async (req: Request, res: Response) => {
      const request = req as AuthenticatedRequest;

      try {
        const drawingId = getRouteParam(req.params.id);
        const existing = await storage.getDrawingById(
          drawingId,
          request.userId,
        );

        if (!existing) {
          res.status(404).json({ error: "Drawing not found" });
          return;
        }

        await storage.deleteDrawing(drawingId, request.userId);
        res.status(204).send();
      } catch (error) {
        console.error("Delete drawing error:", error);
        res.status(500).json({ error: "Failed to delete drawing" });
      }
    },
  );

  // =========================
  // PROGRESS
  // =========================

  app.get("/api/progress", requireAuth, async (req: Request, res: Response) => {
    const request = req as AuthenticatedRequest;

    try {
      const progress = await storage.getUserProgress(request.userId);
      res.json(progress);
    } catch (error) {
      console.error("Get progress error:", error);
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  app.post(
    "/api/progress",
    requireAuth,
    async (req: Request, res: Response) => {
      const request = req as AuthenticatedRequest;

      try {
        const parsed = insertProgressSchema.safeParse(request.body);

        if (!parsed.success) {
          res.status(400).json({ error: "Invalid progress data" });
          return;
        }

        const progress = await storage.upsertProgress(
          request.userId,
          parsed.data,
        );

        res.json(progress);
      } catch (error) {
        console.error("Upsert progress error:", error);
        res.status(500).json({ error: "Failed to update progress" });
      }
    },
  );
}
