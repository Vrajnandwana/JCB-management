// models/FuelExpense.js
import mongoose from 'mongoose';

const FuelExpenseSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  amount: { type: Number, required: true }, // fuel cost in ₹
});

export default mongoose.model('FuelExpense', FuelExpenseSchema);
