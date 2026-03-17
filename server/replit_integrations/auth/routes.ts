import type { Express, Request, Response } from "express";
import bcrypt from "bcryptjs";
import type session from "express-session";
import { storage } from "../../storage";

type SessionWithUser = session.Session & {
  userId?: string;
};

type DevAuthUser = {
  id: string;
  email: string;
  createdAt?: Date | string;
};

type RequestWithOptionalUser = Request & {
  user?: DevAuthUser;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function toSafeUser(user: { id: string; email: string; createdAt?: Date | string }) {
  return {
    id: user.id,
    email: user.email,
    createdAt:
      user.createdAt instanceof Date
        ? user.createdAt.toISOString()
        : user.createdAt,
  };
}

export async function registerRoutes(app: Express) {
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const session = req.session as SessionWithUser;
      const email = normalizeEmail(String(req.body?.email ?? ""));
      const password = String(req.body?.password ?? "");

      if (!email || !password) {
        res.status(400).json({
          error: "Email and password are required",
        });
        return;
      }

      if (!isValidEmail(email)) {
        res.status(400).json({
          error: "Please enter a valid email address",
        });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({
          error: "Password must be at least 6 characters",
        });
        return;
      }

      const existingUser = await storage.getUserByEmail(email);

      if (existingUser) {
        res.status(409).json({
          error: "An account with this email already exists",
        });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await storage.createUser({
        email,
        passwordHash,
      });

      session.userId = user.id;

      res.status(201).json({
        user: toSafeUser(user),
      });
    } catch (error) {
      console.error("Register error:", error);

      res.status(500).json({
        error: "Failed to register user",
      });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const session = req.session as SessionWithUser;
      const email = normalizeEmail(String(req.body?.email ?? ""));
      const password = String(req.body?.password ?? "");

      if (!email || !password) {
        res.status(400).json({
          error: "Email and password are required",
        });
        return;
      }

      const user = await storage.getUserByEmail(email);

      if (!user) {
        res.status(401).json({
          error: "Invalid email or password",
        });
        return;
      }

      const passwordMatches = await bcrypt.compare(password, user.passwordHash);

      if (!passwordMatches) {
        res.status(401).json({
          error: "Invalid email or password",
        });
        return;
      }

      session.userId = user.id;

      res.status(200).json({
        user: toSafeUser(user),
      });
    } catch (error) {
      console.error("Login error:", error);

      res.status(500).json({
        error: "Failed to log in",
      });
    }
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      const session = req.session as SessionWithUser;
      const requestWithUser = req as RequestWithOptionalUser;

      if (requestWithUser.user?.id && requestWithUser.user?.email) {
        res.status(200).json({
          user: toSafeUser(requestWithUser.user),
        });
        return;
      }

      const sessionUserId = session.userId;

      if (!sessionUserId) {
        res.status(401).json({
          error: "Not authenticated",
        });
        return;
      }

      const user = await storage.getUserById(sessionUserId);

      if (!user) {
        session.userId = undefined;

        res.status(401).json({
          error: "Not authenticated",
        });
        return;
      }

      res.status(200).json({
        user: toSafeUser(user),
      });
    } catch (error) {
      console.error("Auth me error:", error);

      res.status(500).json({
        error: "Failed to verify auth session",
      });
    }
  });
}