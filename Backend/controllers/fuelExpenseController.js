// controllers/fuelExpenseController.js
import FuelExpense from '../models/FuelExpense.js';

// Add a new daily fuel expense
export const addFuelExpense = async (req, res) => {
  try {
    const { date, amount } = req.body;
    const expense = new FuelExpense({ date, amount });
    const saved = await expense.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add fuel expense' });
  }
};

// Get monthly fuel expense
export const getMonthlyFuelExpense = async (req, res) => {
  try {
    const { month, year } = req.query;

    const start = new Date(`${year}-${month}-01`);
    const end = new Date(`${year}-${month}-31`);

    const expenses = await FuelExpense.find({
      date: { $gte: start, $lte: end },
    });

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.json({ total, expenses });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch monthly expense' });
  }
};
