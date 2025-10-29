import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import router from './routes/User.routes.js';
import connectDB from './config/db.config.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

connectDB();

const PORT = process.env.PORT || 5000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS only in dev
if (process.env.NODE_ENV === 'development') {
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));
}

app.use(express.json());
app.use(cookieParser());
app.use('/api', router);

// ✅ Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../Client/dist');
  app.use(express.static(distPath));

  // 👇 Catch-all route for React
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
