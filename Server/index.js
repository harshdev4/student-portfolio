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

// const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve();

// CORS only in dev
app.use(cors({
  origin: 'https://student-digital-portfolio.onrender.com',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use('/api', router);

app.use(express.static(path.join(__dirname, "/Client/dist")));
app.get("*", (_, res)=> {
  res.sendFile(path.resolve(__dirname, "/Client", "dist", "index.html"));
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
