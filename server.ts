import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "OPERATIONAL", timestamp: new Date().toISOString() });
  });

  // Admin Authentication Pipeline
  app.post("/api/admin/auth", (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error("[SIGNAL ERROR] ADMIN_PASSWORD mission missing.");
      return res.status(500).json({ error: "Intelligence configuration failure: ADMIN_PASSWORD not set." });
    }

    if (password === adminPassword) {
      return res.json({ success: true, token: "tactical-session-" + Date.now() });
    } else {
      return res.status(401).json({ error: "REJECTED. Authentication signal mismatch." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[TACTICAL SERVER ACTIVE] Running on http://localhost:${PORT}`);
  });
}

startServer();
