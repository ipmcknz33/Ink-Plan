import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { isAuthenticated } from "./replit_integrations/auth";
import {
  insertUserProfileSchema,
  insertDrawingSchema,
  updateDrawingSchema,
  insertProgressSchema,
} from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ============ USER PROFILES ============
  
  app.get("/api/profile", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      let profile = await storage.getUserProfile(userId);
      
      if (!profile) {
        profile = await storage.createUserProfile(userId, {
          displayName: req.user?.claims?.first_name || req.user?.claims?.email || "Artist",
          skillLevel: "Apprentice",
          planId: "free",
        });
      }

      return res.json(profile);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/profile", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const data = insertUserProfileSchema.partial().parse(req.body);
      const profile = await storage.updateUserProfile(userId, data);
      
      return res.json(profile);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  // ============ TATTOO STYLES ============
  
  app.get("/api/styles", isAuthenticated, async (req, res) => {
    try {
      const styles = await storage.getAllStyles();
      return res.json(styles);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/styles/:id", isAuthenticated, async (req, res) => {
    try {
      const style = await storage.getStyleById(req.params.id);
      if (!style) {
        return res.status(404).json({ message: "Style not found" });
      }
      return res.json(style);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // ============ DRAWINGS ============
  
  app.get("/api/drawings", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const drawings = await storage.getUserDrawings(userId);
      return res.json(drawings);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/drawings/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const drawing = await storage.getDrawingById(req.params.id);
      if (!drawing) {
        return res.status(404).json({ message: "Drawing not found" });
      }
      
      if (drawing.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      return res.json(drawing);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/drawings", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const data = insertDrawingSchema.parse(req.body);
      const drawing = await storage.createDrawing(userId, data);
      
      return res.status(201).json(drawing);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/drawings/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const data = updateDrawingSchema.parse(req.body);
      const drawing = await storage.updateDrawing(req.params.id, userId, data);
      
      if (!drawing) {
        return res.status(404).json({ message: "Drawing not found or unauthorized" });
      }

      return res.json(drawing);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/drawings/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      await storage.deleteDrawing(req.params.id, userId);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // ============ PROGRESS ============
  
  app.get("/api/progress", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const progress = await storage.getUserProgress(userId);
      return res.json(progress);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/progress", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const data = insertProgressSchema.parse({ ...req.body, userId });
      const progress = await storage.upsertProgress(data);
      
      return res.json(progress);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  return httpServer;
}
