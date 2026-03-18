import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "./requireAuth";
import { storage } from "../storage";

export type SubscriptionTier = "free" | "pro" | "premium";

const tierRank: Record<SubscriptionTier, number> = {
  free: 0,
  pro: 1,
  premium: 2,
};

export function requireSubscription(minTier: SubscriptionTier) {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const profile = await storage.getUserProfile(req.userId);
      const currentTier = (profile?.subscriptionTier ??
        "free") as SubscriptionTier;

      if (tierRank[currentTier] < tierRank[minTier]) {
        return res.status(403).json({
          error: "Upgrade required",
          requiredTier: minTier,
          currentTier,
        });
      }

      next();
    } catch (error) {
      console.error("Subscription guard error:", error);
      return res.status(500).json({
        error: "Failed to verify subscription",
      });
    }
  };
}
