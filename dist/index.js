// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// shared/schema.ts
import { z } from "zod";
var TestQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswer: z.number().min(0).max(3)
});
var TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  codeExample: z.string().optional()
});
var LessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  content: z.string(),
  // HTML content
  tests: z.array(TestQuestionSchema),
  tasks: z.array(TaskSchema),
  order: z.number()
});
var SectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  lessons: z.array(z.string()),
  // lesson IDs
  order: z.number()
});
var LevelSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  sections: z.array(z.string()),
  // section IDs
  order: z.number(),
  sectionTitles: z.record(z.string()).optional()
  // карта id раздела -> название
});
var LevelsStructureSchema = z.object({
  levels: z.array(LevelSchema)
});
var AdminUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  rememberMe: z.boolean().optional()
});

// server/storage.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var DATA_DIR = path.join(__dirname, "..", "data");
var FileStorage = class {
  async ensureDirectoryExists(dirPath) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }
  async getLevelsStructure() {
    try {
      const filePath = path.join(DATA_DIR, "levels.json");
      const content = await fs.readFile(filePath, "utf-8");
      const data = JSON.parse(content);
      return LevelsStructureSchema.parse(data);
    } catch (error) {
      const defaultStructure = {
        levels: [
          {
            id: "level1",
            title: "\u0423\u0440\u043E\u0432\u0435\u043D\u044C 1: \u041E\u0441\u043D\u043E\u0432\u044B",
            description: "\u0418\u0437\u0443\u0447\u0435\u043D\u0438\u0435 \u043E\u0441\u043D\u043E\u0432 JavaScript",
            sections: ["section1", "section2"],
            order: 1
          },
          {
            id: "level2",
            title: "\u0423\u0440\u043E\u0432\u0435\u043D\u044C 2: \u0421\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u044B \u0434\u0430\u043D\u043D\u044B\u0445",
            description: "\u041C\u0430\u0441\u0441\u0438\u0432\u044B, \u043E\u0431\u044A\u0435\u043A\u0442\u044B \u0438 \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u044B \u0434\u0430\u043D\u043D\u044B\u0445",
            sections: ["section1", "section2"],
            order: 2
          },
          {
            id: "level3",
            title: "\u0423\u0440\u043E\u0432\u0435\u043D\u044C 3: \u0424\u0443\u043D\u043A\u0446\u0438\u0438",
            description: "\u0424\u0443\u043D\u043A\u0446\u0438\u0438, \u0437\u0430\u043C\u044B\u043A\u0430\u043D\u0438\u044F \u0438 \u043E\u0431\u043B\u0430\u0441\u0442\u0438 \u0432\u0438\u0434\u0438\u043C\u043E\u0441\u0442\u0438",
            sections: ["section1", "section2"],
            order: 3
          },
          {
            id: "level4",
            title: "\u0423\u0440\u043E\u0432\u0435\u043D\u044C 4: \u041F\u0440\u043E\u0434\u0432\u0438\u043D\u0443\u0442\u044B\u0435 \u0442\u0435\u043C\u044B",
            description: "\u0410\u0441\u0438\u043D\u0445\u0440\u043E\u043D\u043D\u043E\u0441\u0442\u044C, \u043C\u043E\u0434\u0443\u043B\u0438 \u0438 \u0441\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0439 JavaScript",
            sections: ["section1", "section2"],
            order: 4
          }
        ]
      };
      await this.updateLevelsStructure(defaultStructure);
      return defaultStructure;
    }
  }
  async updateLevelsStructure(structure) {
    await this.ensureDirectoryExists(DATA_DIR);
    const filePath = path.join(DATA_DIR, "levels.json");
    await fs.writeFile(filePath, JSON.stringify(structure, null, 2));
  }
  async updateLevel(levelId, data) {
    const structure = await this.getLevelsStructure();
    const levelIndex = structure.levels.findIndex((level) => level.id === levelId);
    if (levelIndex === -1) {
      throw new Error(`Level with id ${levelId} not found`);
    }
    structure.levels[levelIndex] = {
      ...structure.levels[levelIndex],
      title: data.title
    };
    await this.updateLevelsStructure(structure);
  }
  async getLesson(levelId, sectionId, lessonId) {
    try {
      const filePath = path.join(DATA_DIR, levelId, sectionId, lessonId, `${lessonId}.json`);
      const content = await fs.readFile(filePath, "utf-8");
      const data = JSON.parse(content);
      return LessonSchema.parse(data);
    } catch {
      return null;
    }
  }
  async saveLesson(levelId, sectionId, lessonId, lesson) {
    const dirPath = path.join(DATA_DIR, levelId, sectionId, lessonId);
    await this.ensureDirectoryExists(dirPath);
    const filePath = path.join(dirPath, `${lessonId}.json`);
    await fs.writeFile(filePath, JSON.stringify(lesson, null, 2));
  }
  async createLesson(levelId, sectionId, lesson) {
    await this.saveLesson(levelId, sectionId, lesson.id, lesson);
  }
  async validateAdmin(username, password) {
    return username === "bodryakov.web" && password === "Anna-140275";
  }
};
var storage = new FileStorage();

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/levels", async (_req, res) => {
    try {
      const structure = await storage.getLevelsStructure();
      res.json(structure);
    } catch (error) {
      res.status(500).json({ error: "Failed to load levels structure" });
    }
  });
  app2.put("/api/levels", async (req, res) => {
    try {
      const structure = LevelsStructureSchema.parse(req.body);
      await storage.updateLevelsStructure(structure);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Invalid levels structure" });
    }
  });
  app2.patch("/api/levels/:levelId", async (req, res) => {
    try {
      const { levelId } = req.params;
      const { title } = req.body;
      if (!title || typeof title !== "string") {
        return res.status(400).json({ error: "Title is required" });
      }
      await storage.updateLevel(levelId, { title });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update level" });
    }
  });
  app2.get("/api/lessons/:levelId/:sectionId/:lessonId", async (req, res) => {
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
  app2.put("/api/lessons/:levelId/:sectionId/:lessonId", async (req, res) => {
    try {
      const { levelId, sectionId, lessonId } = req.params;
      const lesson = LessonSchema.parse(req.body);
      await storage.saveLesson(levelId, sectionId, lessonId, lesson);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Invalid lesson data" });
    }
  });
  app2.post("/api/lessons/:levelId/:sectionId", async (req, res) => {
    try {
      const { levelId, sectionId } = req.params;
      const lesson = LessonSchema.parse(req.body);
      await storage.createLesson(levelId, sectionId, lesson);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Invalid lesson data" });
    }
  });
  app2.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = AdminUserSchema.parse(req.body);
      const isValid = await storage.validateAdmin(username, password);
      if (isValid) {
        res.json({ success: true, token: "admin-token" });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      res.status(400).json({ error: "Invalid request data" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
