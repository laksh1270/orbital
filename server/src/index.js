import express from "express";
import cors from "cors";
import { auth } from "./lib/auth.js";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";

const app = express();

// ✅ Render provides PORT automatically
const PORT = process.env.PORT || 3005;

// ✅ Safe default when frontend is not hosted yet
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

/* -------------------- MIDDLEWARE -------------------- */

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

// ✅ Better Auth handler
app.all("/api/auth/*splat", toNodeHandler(auth));

/* -------------------- ROUTES -------------------- */

// ✅ Health check (IMPORTANT for Render)
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    service: "Orbital Backend",
    env: process.env.NODE_ENV || "production",
  });
});

// ✅ Get current session (cookie / bearer compatible)
app.get("/api/me", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "No active session" });
    }

    res.json(session);
  } catch (err) {
    console.error("Session error:", err);
    res.status(500).json({ error: "Failed to get session" });
  }
});

// ⚠️ Optional legacy token route (can remove later)
app.get("/api/me/:access_token", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: {
        authorization: `Bearer ${req.params.access_token}`,
      },
    });

    if (!session) {
      return res.status(401).json({ error: "Invalid token" });
    }

    res.json(session);
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
});

// ✅ Device flow redirect (CLI → frontend)
app.get("/device", (req, res) => {
  const { user_code } = req.query;
  res.redirect(`${CLIENT_URL}/device?user_code=${user_code}`);
});

/* -------------------- START SERVER -------------------- */

app.listen(PORT, () => {
  console.log(`✅ Orbital backend running on port ${PORT}`);
});
