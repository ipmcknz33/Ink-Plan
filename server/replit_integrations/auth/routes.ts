import type { Express, Request, Response } from "express";
import bcrypt from "bcryptjs";
import type session from "express-session";
import { storage } from "../../storage";
import { generateTattooCoachReply } from "./services/ai";

type SessionWithUser = session.Session & {
  userId?: string;
};

type RequestWithSession = Request & {
  session: SessionWithUser;
  user?: {
    id: string;
    email: string;
    createdAt?: Date | string;
  };
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

function toSafeUser(user: {
  id: string;
  email: string;
  createdAt?: Date | string;
}) {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
  };
}

async function ensureUserProfile(userId: string) {
  const existingProfile = await storage.getUserProfile(userId);

  if (!existingProfile) {
    await storage.createUserProfile(userId, {
      subscriptionTier: "free",
    });
  }
}

export async function registerRoutes(app: Express): Promise<void> {
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    const request = req as RequestWithSession;

    try {
      const email = normalizeEmail(String(request.body?.email ?? ""));
      const password = String(request.body?.password ?? "");

      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      if (!isValidEmail(email)) {
        res.status(400).json({ error: "Please enter a valid email" });
        return;
      }

      if (password.length < 6) {
        res
          .status(400)
          .json({ error: "Password must be at least 6 characters" });
        return;
      }

      const existingUser = await storage.getUserByEmail(email);

      if (existingUser) {
        res
          .status(409)
          .json({ error: "An account with this email already exists" });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await storage.createUser({
        email,
        passwordHash,
      });

      await ensureUserProfile(user.id);

      request.session.userId = user.id;

      request.session.save((saveError) => {
        if (saveError) {
          console.error("Register session save error:", saveError);
          res.status(500).json({ error: "Failed to register user" });
          return;
        }

        res.status(201).json({
          user: toSafeUser(user),
        });
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const request = req as RequestWithSession;

    try {
      const email = normalizeEmail(String(request.body?.email ?? ""));
      const password = String(request.body?.password ?? "");

      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      const user = await storage.getUserByEmail(email);

      if (!user) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      await ensureUserProfile(user.id);

      request.session.userId = user.id;

      request.session.save((saveError) => {
        if (saveError) {
          console.error("Login session save error:", saveError);
          res.status(500).json({ error: "Failed to log in" });
          return;
        }

        res.status(200).json({
          user: toSafeUser(user),
        });
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to log in" });
    }
  });

  app.post("/api/auth/guest", async (req: Request, res: Response) => {
    const request = req as RequestWithSession;

    try {
      const guestEmail = `guest_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}@inkplan.local`;

      const guestPassword = Math.random().toString(36).repeat(2);
      const passwordHash = await bcrypt.hash(guestPassword, 10);

      const user = await storage.createUser({
        email: guestEmail,
        passwordHash,
      });

      await ensureUserProfile(user.id);

      request.session.userId = user.id;

      request.session.save((saveError) => {
        if (saveError) {
          console.error("Guest session save error:", saveError);
          res.status(500).json({ error: "Failed to create guest session" });
          return;
        }

        res.status(201).json({
          user: toSafeUser(user),
        });
      });
    } catch (error) {
      console.error("Guest auth error:", error);
      res.status(500).json({ error: "Failed to continue as guest" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    const request = req as RequestWithSession;

    if (!request.session) {
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out successfully" });
      return;
    }

    request.session.destroy((destroyError) => {
      if (destroyError) {
        console.error("Logout error:", destroyError);
        res.status(500).json({ error: "Failed to log out" });
        return;
      }

      res.clearCookie("connect.sid", {
        path: "/",
      });

      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    const request = req as RequestWithSession;

    try {
      const userId = request.session?.userId;

      if (!userId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const user = await storage.getUserById(userId);

      if (!user) {
        request.session.userId = undefined;

        request.session.save((saveError) => {
          if (saveError) {
            console.error("Session cleanup error:", saveError);
          }

          res.status(401).json({ error: "Not authenticated" });
        });
        return;
      }

      await ensureUserProfile(user.id);

      res.status(200).json({
        user: toSafeUser(user),
      });
    } catch (error) {
      console.error("Get current user error:", error);
      res.status(500).json({ error: "Failed to fetch current user" });
    }
  });

  app.post("/api/ai/coach", async (req: Request, res: Response) => {
    try {
      const message = String(req.body?.message ?? "").trim();

      if (!message) {
        res.status(400).json({ error: "Message is required" });
        return;
      }

      const reply = await generateTattooCoachReply(message);

      res.status(200).json({ reply });
    } catch (error) {
      console.error("AI coach error:", error);
      res.status(500).json({ error: "Failed to generate AI coach reply" });
    }
  });
}
