// routes/fuelRoutes.js
import express from 'express';
import { addFuelExpense, getMonthlyFuelExpense } from '../controllers/fuelExpenseController.js';

const router = express.Router();

router.post('/', addFuelExpense); // POST /api/fuel
router.get('/monthly', getMonthlyFuelExpense); // GET /api/fuel/monthly?month=05&year=2025

export default router;
