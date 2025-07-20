import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { LevelsStructureSchema, LessonSchema, AdminUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get levels structure
  app.get("/api/levels", async (_req, res) => {
    try {
      const structure = await storage.getLevelsStructure();
      res.json(structure);
    } catch (error) {
      res.status(500).json({ error: "Failed to load levels structure" });
    }
  });

  // Update levels structure (admin only)
  app.put("/api/levels", async (req, res) => {
    try {
      const structure = LevelsStructureSchema.parse(req.body);
      await storage.updateLevelsStructure(structure);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Invalid levels structure" });
    }
  });

  // Get lesson content
  app.get("/api/lessons/:levelId/:sectionId/:lessonId", async (req, res) => {
    try {
      const { levelId, sectionId, lessonId } = req.params;
      const lesson = await storage.getLesson(levelId, sectionId, lessonId);
      
      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }
      
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ error: "Failed to load lesson" });
    }
  });

  // Save lesson content (admin only)
  app.put("/api/lessons/:levelId/:sectionId/:lessonId", async (req, res) => {
    try {
      const { levelId, sectionId, lessonId } = req.params;
      const lesson = LessonSchema.parse(req.body);
      
      await storage.saveLesson(levelId, sectionId, lessonId, lesson);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Invalid lesson data" });
    }
  });

  // Create new lesson (admin only)
  app.post("/api/lessons/:levelId/:sectionId", async (req, res) => {
    try {
      const { levelId, sectionId } = req.params;
      const lesson = LessonSchema.parse(req.body);
      
      await storage.createLesson(levelId, sectionId, lesson);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Invalid lesson data" });
    }
  });

  // Admin authentication
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = AdminUserSchema.parse(req.body);
      const isValid = await storage.validateAdmin(username, password);
      
      if (isValid) {
        // Set session or return token (simplified for this example)
        res.json({ success: true, token: "admin-token" });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
