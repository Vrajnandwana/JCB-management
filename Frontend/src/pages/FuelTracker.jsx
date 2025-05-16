import React, { useState, useEffect } from 'react';

function FuelTracker() {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [expenses, setExpenses] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('fuelExpenses')) || [];
    setExpenses(stored);
  }, []);

  // Save to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem('fuelExpenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = () => {
    if (!amount || !date) {
      alert('Please enter both date and amount');
      return;
    }

    const newExpense = { date, amount: parseFloat(amount) };
    setExpenses([...expenses, newExpense]);
    setAmount('');
    setDate('');
  };

  const monthlyTotal = expenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">Fuel Expense Tracker</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <input
          type="number"
          placeholder="Fuel Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      <div className="text-center mb-6">
        <button
          onClick={handleAddExpense}
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
        >
          Add
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h3 className="text-lg font-semibold mb-2 text-center">
          Monthly Total: ₹{monthlyTotal.toFixed(2)}
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-300">
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{new Date(exp.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-right">₹{exp.amount}</td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td className="px-4 py-2 text-center" colSpan={2}>No records yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FuelTracker;
