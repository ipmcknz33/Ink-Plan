import type { NextFunction, Request, Response } from "express";

type SessionRequest = Request & {
  session: {
    userId?: string;
  };
  userId?: string;
};

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const request = req as SessionRequest;
  const userId = request.session?.userId;

  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  request.userId = userId;
  next();
}
