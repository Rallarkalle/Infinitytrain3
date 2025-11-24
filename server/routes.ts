import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./sqlite-storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Topics API
  app.get("/api/topics", async (_req, res) => {
    try {
      const topics = await storage.getTopics();
      res.json(topics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch topics" });
    }
  });

  app.post("/api/topics", async (req, res) => {
    try {
      const topic = req.body;
      await storage.saveTopic(topic);
      res.json(topic);
    } catch (error) {
      res.status(500).json({ error: "Failed to save topic" });
    }
  });

  app.put("/api/topics/:id", async (req, res) => {
    try {
      const topic = req.body;
      await storage.updateTopic(topic);
      res.json(topic);
    } catch (error) {
      res.status(500).json({ error: "Failed to update topic" });
    }
  });

  app.delete("/api/topics/:id", async (req, res) => {
    try {
      await storage.deleteTopic(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete topic" });
    }
  });

  app.post("/api/topics/:id/restore", async (req, res) => {
    try {
      await storage.restoreTopic(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to restore topic" });
    }
  });

  // Progress API
  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const progress = await storage.getProgress(req.params.userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      const progress = req.body;
      await storage.saveProgress(progress);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to save progress" });
    }
  });

  // Users API
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Comments API
  app.post("/api/comments", async (req, res) => {
    try {
      const { subtopicId, comment } = req.body;
      await storage.addComment(subtopicId, comment);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save comment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
