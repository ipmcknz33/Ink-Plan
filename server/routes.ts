import type { Express, Request, Response } from "express";
import bcrypt from "bcryptjs";
import type session from "express-session";
import Stripe from "stripe";
import { storage } from "./storage";
import { generateTattooCoachReply } from "./services/ai";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY ?? "";

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

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

type AccessPhase = "trial" | "subscribed" | "expired";
type SubscriptionTier = "free" | "pro" | "premium";

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

function toDateValue(value?: Date | string | null): Date | null {
  if (!value) return null;

  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getAccessStatus(params: {
  user: {
    id: string;
    email: string;
    createdAt?: Date | string | null;
  };
  profile:
    | {
        subscriptionTier?: "free" | "pro" | "premium" | string | null;
      }
    | null
    | undefined;
}) {
  const subscriptionTier = (params.profile?.subscriptionTier ??
    "free") as SubscriptionTier;

  const createdAt = toDateValue(params.user.createdAt ?? null);
  const trialStartedAt = createdAt ? createdAt.toISOString() : null;

  const trialEndsAt = createdAt
    ? new Date(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString()
    : null;

  let phase: AccessPhase = "trial";

  if (subscriptionTier === "pro" || subscriptionTier === "premium") {
    phase = "subscribed";
  } else if (trialEndsAt) {
    phase =
      new Date(trialEndsAt).getTime() > Date.now() ? "trial" : "expired";
  }

  return {
    phase,
    subscriptionTier,
    trialStartedAt,
    trialEndsAt,
    accessibleStyles:
      phase === "subscribed"
        ? ["fine-line", "blackwork", "traditional", "lettering"]
        : phase === "trial"
          ? ["fine-line", "blackwork"]
          : [],
    lockedPreview: [
      "black-grey",
      "japanese",
      "chicano",
      "japanese-realism",
      "geometric",
      "biomechanical",
      "polynesian",
      "color-realism",
      "surrealism",
      "watercolor",
    ],
  };
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
      const profile = await storage.getUserProfile(user.id);

      request.session.userId = user.id;

      request.session.save((saveError) => {
        if (saveError) {
          console.error("Register session save error:", saveError);
          res.status(500).json({ error: "Failed to register user" });
          return;
        }

        res.status(201).json({
          user: toSafeUser(user),
          access: getAccessStatus({
            user,
            profile,
          }),
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
      const profile = await storage.getUserProfile(user.id);

      request.session.userId = user.id;

      request.session.save((saveError) => {
        if (saveError) {
          console.error("Login session save error:", saveError);
          res.status(500).json({ error: "Failed to log in" });
          return;
        }

        res.status(200).json({
          user: toSafeUser(user),
          access: getAccessStatus({
            user,
            profile,
          }),
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
      const profile = await storage.getUserProfile(user.id);

      request.session.userId = user.id;

      request.session.save((saveError) => {
        if (saveError) {
          console.error("Guest session save error:", saveError);
          res.status(500).json({ error: "Failed to create guest session" });
          return;
        }

        res.status(201).json({
          user: toSafeUser(user),
          access: getAccessStatus({
            user,
            profile,
          }),
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
      res.clearCookie("inkplan.sid");
      res.status(200).json({ message: "Logged out successfully" });
      return;
    }

    request.session.destroy((destroyError) => {
      if (destroyError) {
        console.error("Logout error:", destroyError);
        res.status(500).json({ error: "Failed to log out" });
        return;
      }

      res.clearCookie("inkplan.sid", {
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
      const profile = await storage.getUserProfile(user.id);

      res.status(200).json({
        user: toSafeUser(user),
        access: getAccessStatus({
          user,
          profile,
        }),
      });
    } catch (error) {
      console.error("Get current user error:", error);
      res.status(500).json({ error: "Failed to fetch current user" });
    }
  });

  app.get("/api/access/status", async (req: Request, res: Response) => {
    const request = req as RequestWithSession;

    try {
      const userId = request.session?.userId;

      if (!userId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const user = await storage.getUserById(userId);

      if (!user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      await ensureUserProfile(user.id);
      const profile = await storage.getUserProfile(user.id);

      res.status(200).json(
        getAccessStatus({
          user,
          profile,
        }),
      );
    } catch (error) {
      console.error("Get access status error:", error);
      res.status(500).json({ error: "Failed to fetch access status" });
    }
  });

  app.post(
    "/api/billing/create-checkout-session",
    async (req: Request, res: Response) => {
      const request = req as RequestWithSession;

      try {
        if (!request.session?.userId) {
          res.status(401).json({ error: "Not authenticated" });
          return;
        }

        if (!stripe) {
          res.status(500).json({
            error:
              "Stripe is not configured. Add STRIPE_SECRET_KEY to your server environment.",
          });
          return;
        }

        const plan = String(req.body?.plan ?? "")
          .trim()
          .toLowerCase();

        if (plan !== "pro") {
          res.status(400).json({ error: "Invalid plan selected" });
          return;
        }

        const origin = `${req.protocol}://${req.get("host")}`;

        const checkoutSession = await stripe.checkout.sessions.create({
          mode: "subscription",
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "InkPlan Pro",
                  description: "Unlock Traditional and Lettering starter packs",
                },
                unit_amount: 2400,
                recurring: {
                  interval: "month",
                },
              },
              quantity: 1,
            },
          ],
          success_url: `${origin}/upgrade?checkout=success`,
          cancel_url: `${origin}/upgrade?checkout=cancelled`,
        });

        if (!checkoutSession.url) {
          res
            .status(500)
            .json({ error: "Stripe did not return a checkout URL" });
          return;
        }

        res.status(200).json({ url: checkoutSession.url });
      } catch (error) {
        console.error("Create checkout session error:", error);
        res.status(500).json({ error: "Failed to create checkout session" });
      }
    },
  );

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
      res.status(500).json({
        error:
          error instanceof Error && error.message.includes("RESOURCE_EXHAUSTED")
            ? "AI coach is a little busy right now. Try again in a moment."
            : "Something went wrong with your AI coach. Please try again.",
      });
    }
  });
}