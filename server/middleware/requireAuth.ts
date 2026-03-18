import type { NextFunction, Request, Response } from "express";
import type session from "express-session";

type SessionWithUser = session.Session & {
  userId?: string;
};

export type AuthenticatedRequest = Request & {
  session: SessionWithUser;
  userId: string;
};

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const request = req as AuthenticatedRequest;
  const userId = request.session?.userId;

  if (!userId) {
    return res.status(401).json({
      error: "Not authenticated",
    });
  }

  request.userId = userId;
  next();
}
