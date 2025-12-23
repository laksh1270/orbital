import express from "express";
import cors from "cors";
import { auth } from "./lib/auth.js";
import { toNodeHandler } from "better-auth/node";

const app = express();
const port = process.env.PORT || 3005;

const CLIENT_URL = process.env.CLIENT_URL;

app.use(express.json());

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

/**
 * ✅ THIS IS THE MOST IMPORTANT LINE
 * ❌ DO NOT use *splat
 */
app.all("/api/auth/*", toNodeHandler(auth));

app.get("/", (req, res) => {
  res.json({ status: "OK", service: "Orbital Backend" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
