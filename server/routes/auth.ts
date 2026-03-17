import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { storage } from "../storage";

const router = Router();

type RegisterBody = {
  email?: string;
  password?: string;
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
  created_at?: Date | string | null;
}) {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt ?? user.created_at ?? null,
  };
}

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as RegisterBody;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters.",
      });
    }

    const existingUser = await storage.getUserByEmail(normalizedEmail);

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await storage.createUser({
      email: normalizedEmail,
      passwordHash,
    });

    await storage.createUserProfile(newUser.id, {});

    return res.status(201).json({
      message: "User registered successfully.",
      user: toSafeUser(newUser),
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

export default router;