// Backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import siteRoutes from './routes/siteRoutes.js';
import dailyLogRoutes from './routes/dailyLogRoutes.js';

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// DB Connection
connectDB();

// Routes
app.use('/api/sites', siteRoutes);

//dailylogs 
app.use('/api/dailylogs', dailyLogRoutes);

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
