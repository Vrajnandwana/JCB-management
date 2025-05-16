import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function SiteLogs() {
  const { siteId } = useParams();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [site, setSite] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingLog, setEditingLog] = useState(null);

  const [filterDate, setFilterDate] = useState('');
  const [filterMachineType, setFilterMachineType] = useState('');

  useEffect(() => {
    const fetchLogsAndSite = async () => {
      try {
        const siteRes = await fetch(`http://localhost:5000/api/sites/${siteId}`);
        const logsRes = await fetch(`http://localhost:5000/api/dailylogs/${siteId}`);
        if (!siteRes.ok || !logsRes.ok) throw new Error('Error fetching data');
        const siteData = await siteRes.json();
        const logsData = await logsRes.json();
        logsData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setLogs(logsData);
        setSite(siteData);
        setFilteredLogs(logsData);
        calculateTotal(logsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogsAndSite();
  }, [siteId]);

  const calculateTotal = (logs) => {
    const total = logs.reduce(
      (acc, log) => acc + (log.hoursUsed || 0) * (log.rate || 0),
      0
    );
    setTotalAmount(total);
  };

  // FILTERING
  useEffect(() => {
    const filtered = logs.filter((log) => {
      const matchesDate = filterDate ? log.date?.substring(0, 10) === filterDate : true;
      const matchesMachine = filterMachineType ? log.machineType === filterMachineType : true;
      return matchesDate && matchesMachine;
    });
    setFilteredLogs(filtered);
    calculateTotal(filtered);
  }, [filterDate, filterMachineType, logs]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      const res = await fetch(`http://localhost:5000/api/sites/${siteId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      setSite((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleEdit = (log) => setEditingLog({ ...log });

  const handleDelete = async (logId) => {
    if (!window.confirm('Are you sure you want to delete this log?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/dailylogs/${logId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      const updatedLogs = logs.filter((log) => log._id !== logId);
      setLogs(updatedLogs);
    } catch (err) {
      alert('Error deleting log');
    }
  };

  const submitUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/dailylogs/${editingLog._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingLog),
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      const updatedLogs = logs.map((log) => (log._id === updated._id ? updated : log));
      setLogs(updatedLogs);
      setEditingLog(null);
    } catch (err) {
      alert('Error updating log');
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  const machineTypes = [...new Set(logs.map((log) => log.machineType))];

  return (
  <div className="p-4 sm:p-6 max-w-7xl mx-auto">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
      <img src="/logo.png" alt="Business Logo" className="h-10 sm:h-12 w-auto" />
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center sm:text-left">
        Site Logs & Billing
      </h2>
    </div>

    {/* ...loading, error, and site info (unchanged) */}

    {/* Filters */}
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-4 items-start sm:items-end">
      <div>
        <label className="block text-sm text-gray-600">Filter by Date</label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600">Filter by Machine</label>
        <select
          value={filterMachineType}
          onChange={(e) => setFilterMachineType(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">All</option>
          {machineTypes.map((type, i) => (
            <option key={i} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div>
        <button
          onClick={() => {
            setFilterDate('');
            setFilterMachineType('');
          }}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 text-sm w-full"
        >
          Reset Filters
        </button>
      </div>
    </div>

    <div className="text-right mb-3">
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm sm:text-base"
        onClick={() =>
          window.open(`http://localhost:5000/api/dailylogs/download/${siteId}`, '_blank')
        }
      >
        Download Excel
      </button>
    </div>

    {/* Responsive Table Container */}
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-300 shadow text-sm sm:text-base">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Machine</th>
            <th className="p-2 border">Hours</th>
            <th className="p-2 border">Rate (₹)</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((log, i) => (
            <tr key={i} className="text-center">
              <td className="p-2 border">{new Date(log.date).toLocaleDateString('en-IN')}</td>
              <td className="p-2 border">{log.machineType}</td>
              <td className="p-2 border">{log.hoursUsed || 0}</td>
              <td className="p-2 border">{formatCurrency(log.rate || 0)}</td>
              <td className="p-2 border">{formatCurrency((log.hoursUsed || 0) * (log.rate || 0))}</td>
              <td className="p-2 border space-x-1">
                <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs sm:text-sm" onClick={() => handleEdit(log)}>Edit</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded text-xs sm:text-sm" onClick={() => handleDelete(log._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-100 text-gray-800 font-semibold text-center">
            <td colSpan="4" className="p-2 border">Total</td>
            <td className="p-2 border">{formatCurrency(totalAmount)}</td>
            <td className="p-2 border"></td>
          </tr>
        </tfoot>
      </table>
    </div>

    {/* Editing Form (unchanged logic-wise) */}
    {editingLog && (
      <div className="mt-6 p-4 border rounded bg-gray-100">
        <h3 className="text-lg font-semibold mb-3">Edit Log Entry</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Inputs */}
          <div>
  <label className="block text-sm font-medium mb-1">Date</label>
  <input
    type="date"
    value={editingLog.date?.substring(0, 10) || ''}
    onChange={(e) =>
      setEditingLog((prev) => ({ ...prev, date: e.target.value }))
    }
    className="border p-2 rounded w-full"
  />
</div>

<div>
  <label className="block text-sm font-medium mb-1">Machine Type</label>
  <input
    type="text"
    value={editingLog.machineType || ''}
    onChange={(e) =>
      setEditingLog((prev) => ({ ...prev, machineType: e.target.value }))
    }
    className="border p-2 rounded w-full"
  />
</div>

<div>
  <label className="block text-sm font-medium mb-1">Hours Used</label>
  <input
    type="number"
    min="0"
    step="0.1"
    value={editingLog.hoursUsed || ''}
    onChange={(e) =>
      setEditingLog((prev) => ({ ...prev, hoursUsed: parseFloat(e.target.value) || 0 }))
    }
    className="border p-2 rounded w-full"
  />
</div>

<div>
  <label className="block text-sm font-medium mb-1">Rate (₹)</label>
  <input
    type="number"
    min="0"
    step="1"
    value={editingLog.rate || ''}
    onChange={(e) =>
      setEditingLog((prev) => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))
    }
    className="border p-2 rounded w-full"
  />
</div>

        </div>
        <div className="mt-4 flex gap-2 flex-wrap">
          <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={submitUpdate}>
            Save
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setEditingLog(null)}>
            Cancel
          </button>
        </div>
      </div>
    )}

    {!loading && logs.length === 0 && (
      <p className="text-center text-gray-600 mt-4">No logs available for this site.</p>
    )}
  </div>
);

}

export default SiteLogs;
