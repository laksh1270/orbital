import express from "express";
import cors from "cors";
import { auth } from "./lib/auth.js";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";

const app = express();

/* -------------------- ENV -------------------- */

const PORT = process.env.PORT || 3005;
const CLIENT_URL = process.env.CLIENT_URL;

/* -------------------- MIDDLEWARE -------------------- */

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

/* -------------------- AUTH (CRITICAL) -------------------- */

/**
 * ✅ DO NOT use wildcards like *splat
 * ✅ Better Auth expects the BASE PATH only
 */
app.use("/api/auth", toNodeHandler(auth));

/* -------------------- ROUTES -------------------- */

// Health check (Render needs this)
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    service: "Orbital Backend",
  });
});

// Get current session
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
    console.error(err);
    res.status(500).json({ error: "Failed to get session" });
  }
});

// Device flow redirect (CLI → frontend)
app.get("/device", (req, res) => {
  const { user_code } = req.query;
  res.redirect(`${CLIENT_URL}/device?user_code=${user_code}`);
});

/* -------------------- START -------------------- */

app.listen(PORT, () => {
  console.log(`✅ Orbital backend running on port ${PORT}`);
});
