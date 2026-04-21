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

  // Tactical Intelligence Route
  app.post("/api/contact", (req, res) => {
    const { firstName, lastName, university, email, target, payload } = req.body;
    
    // Log extraction request to the secure server environment
    console.log(`[EXTRACTION SIGNAL RECEIVED]`);
    console.log(`- TARGET ACCOUNT  : help@degreegate.com`);
    console.log(`- CODENAME        : ${firstName} ${lastName}`);
    console.log(`- UNIVERSITY      : ${university}`);
    console.log(`- INTEL PATH      : ${email}`);
    console.log(`- DEPLOYMENT      : ${target}`);
    console.log(`- PAYLOAD         : ${payload}`);

    /**
     * MISSION NOTE:
     * To enable real-time email notifications to help@degreegate.com, 
     * integrate a service like SendGrid, Resend, or Mailgun here.
     * Use process.env.EMAIL_SERVICE_API_KEY for authorization.
     */
    
    res.json({ 
      status: "SUCCESS", 
      message: "Signal locked. Intelligence routed to central extraction unit." 
    });
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
