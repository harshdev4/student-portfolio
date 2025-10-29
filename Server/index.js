import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.config.js";
import router from "./routes/User.routes.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- MIDDLEWARES ----------
app.use(express.json());
app.use(cookieParser());

// ✅ Allow CORS only in development
if (process.env.NODE_ENV !== "production") {
  const allowedOrigins = ["http://localhost:5173"];
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    })
  );
}

// ---------- ROUTES ----------
app.use("/api", router);

// ---------- SERVE FRONTEND IN PRODUCTION ----------
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/build");

  // Serve static files
  app.use(express.static(frontendPath));

  // Handle all other routes
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
}

// ---------- START SERVER ----------
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
