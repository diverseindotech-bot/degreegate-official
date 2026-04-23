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

  // Tactical Newsletter Subscription
  app.post("/api/newsletter/subscribe", async (req, res) => {
    const { email } = req.body;
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      console.error("[SIGNAL ERROR] BREVO_API_KEY mission missing.");
      return res.status(500).json({ error: "Intelligence configuration failure." });
    }

    try {
      const response = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "api-key": apiKey
        },
        body: JSON.stringify({
          email: email,
          updateEnabled: true
        })
      });

      if (response.ok) {
        return res.json({ success: true, message: "Signal accepted. Tactical updates pending." });
      } else {
        const errorData = await response.json();
        console.error("[SIGNAL COLLISION] Brevo rejection:", errorData);
        return res.status(response.status).json({ error: "Signal interference. Try again later." });
      }
    } catch (error) {
      console.error("[SIGNAL LOSS] Operational failure:", error);
      return res.status(500).json({ error: "Communication link severed." });
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
