import express from "express";
import path from "path";
import axios from "axios";
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

  // Admin Authentication Pipeline (Universal for Local and Netlify)
  app.post(["/api/admin/auth", "/api/admin-auth"], (req, res) => {
    const { password } = req.body;
    let adminPassword = process.env.ADMIN_PASSWORD;

    // Tactical Fallback for easier setup
    if (!adminPassword) {
      console.warn("[SIGNAL WARNING] ADMIN_PASSWORD not set. Using tactical fallback 'tactical123'");
      adminPassword = "tactical123";
    }

    if (password === adminPassword) {
      return res.json({ success: true, token: "tactical-session-" + Date.now() });
    } else {
      return res.status(401).json({ error: "REJECTED. Authentication signal mismatch." });
    }
  });

  // Brevo Gateway Signup Pipeline
  app.post("/api/gateway-signup", async (req, res) => {
    const { firstName, lastName, email, university, country } = req.body;
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      console.error("[SIGNAL ERROR] BREVO_API_KEY is missing");
      return res.status(500).json({ error: "Brevo API key not configured on server." });
    }

    try {
      await axios.post(
        "https://api.brevo.com/v3/contacts",
        {
          email,
          attributes: {
            FIRSTNAME: firstName,
            LASTNAME: lastName,
            UNIVERSITY: university,
            COUNTRY: country,
          },
          // We assume the user has a list for them. 
          // If the list ID is unknown, we omit listIds to add to default or 
          // user can update this ID later.
          // listIds: [2] 
        },
        {
          headers: {
            'api-key': apiKey,
            'content-type': 'application/json'
          }
        }
      );
      res.json({ success: true, message: "Welcome to DegreeGate Gateway. Check your inbox soon." });
    } catch (error: any) {
      console.error("[BREVO ERROR]", error.response?.data || error.message);
      // Even if it fails (e.g. contact already exists), we might want to return success to the user 
      // or handle the "already exists" case gracefully.
      if (error.response?.data?.code === 'duplicate_parameter') {
        return res.json({ success: true, message: "Welcome back! You're already part of the Gateway." });
      }
      res.status(error.response?.status || 500).json({ error: "Failed to connect to gateway protocol." });
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
