import type { Express, Request, Response } from "express";
import bcrypt from "bcryptjs";
import session from "express-session";
import { storage } from "../storage";

type SessionWithUser = session.Session & {
  userId?: string;
};

type RequestWithSession = Request & {
  session: SessionWithUser;
};

type SafeUser = {
  id: string;
  email: string;
  createdAt?: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function toSafeUser(user: {
  id: string;
  email: string;
  createdAt?: Date | string | null;
}): SafeUser {
  return {
    id: user.id,
    email: user.email,
    createdAt:
      user.createdAt instanceof Date
        ? user.createdAt.toISOString()
        : user.createdAt ?? undefined,
  };
}

function getBody(req: Request) {
  const body = req.body as {
    email?: string;
    password?: string;
  };

  return {
    email: body.email ?? "",
    password: body.password ?? "",
  };
}

function saveSession(req: RequestWithSession) {
  return new Promise<void>((resolve, reject) => {
    req.session.save((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function destroySession(req: RequestWithSession) {
  return new Promise<void>((resolve, reject) => {
    req.session.destroy((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

export function registerAuthRoutes(app: Express) {
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      const request = req as RequestWithSession;
      const userId = request.session.userId;

      if (!userId) {
        return res.status(200).json({
          user: null,
          authenticated: false,
        });
      }

      const user = await storage.getUserById(userId);

      if (!user) {
        delete request.session.userId;

        await saveSession(request);

        return res.status(200).json({
          user: null,
          authenticated: false,
        });
      }

      return res.status(200).json({
        user: toSafeUser(user),
        authenticated: true,
      });
    } catch (error) {
      console.error("GET /api/auth/me error:", error);

      return res.status(500).json({
        error: "Failed to check session.",
      });
    }
  });

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const request = req as RequestWithSession;
      const { email, password } = getBody(req);

      const normalizedEmail = normalizeEmail(email);

      if (!normalizedEmail || !password) {
        return res.status(400).json({
          error: "Email and password are required.",
        });
      }

      if (!isValidEmail(normalizedEmail)) {
        return res.status(400).json({
          error: "Please enter a valid email address.",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          error: "Password must be at least 6 characters.",
        });
      }

      const existingUser = await storage.getUserByEmail(normalizedEmail);

      if (existingUser) {
        return res.status(409).json({
          error: "An account with that email already exists.",
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const createdUser = await storage.createUser({
        email: normalizedEmail,
        passwordHash,
      });

      request.session.userId = createdUser.id;
      await saveSession(request);

      return res.status(201).json({
        user: toSafeUser(createdUser),
        authenticated: true,
      });
    } catch (error) {
      console.error("POST /api/auth/register error:", error);

      return res.status(500).json({
        error: "Failed to create account.",
      });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const request = req as RequestWithSession;
      const { email, password } = getBody(req);

      const normalizedEmail = normalizeEmail(email);

      if (!normalizedEmail || !password) {
        return res.status(400).json({
          error: "Email and password are required.",
        });
      }

      const user = await storage.getUserByEmail(normalizedEmail);

      if (!user) {
        return res.status(401).json({
          error: "Invalid email or password.",
        });
      }

      const passwordIsValid = await bcrypt.compare(password, user.passwordHash);

      if (!passwordIsValid) {
        return res.status(401).json({
          error: "Invalid email or password.",
        });
      }

      request.session.userId = user.id;
      await saveSession(request);

      return res.status(200).json({
        user: toSafeUser(user),
        authenticated: true,
      });
    } catch (error) {
      console.error("POST /api/auth/login error:", error);

      return res.status(500).json({
        error: "Failed to sign in.",
      });
    }
  });

  app.post("/api/auth/logout", async (req: Request, res: Response) => {
    try {
      const request = req as RequestWithSession;

      await destroySession(request);

      res.clearCookie("connect.sid");

      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.error("POST /api/auth/logout error:", error);

      return res.status(500).json({
        error: "Failed to sign out.",
      });
    }
  });
}