import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function SiteLogs() {
  const { siteId } = useParams();
  const [logs, setLogs] = useState([]);
  const [site, setSite] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch site details
        const siteRes = await fetch(`http://localhost:5000/api/sites/${siteId}`);
        if (!siteRes.ok) throw new Error('Failed to fetch site');
        const siteData = await siteRes.json();
        setSite(siteData);

        // Fetch logs
        const logsRes = await fetch(`http://localhost:5000/api/dailylogs/${siteId}`);
        if (!logsRes.ok) throw new Error('Failed to fetch logs');
        const logsData = await logsRes.json();

        // Sort logs by date descending
        logsData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setLogs(logsData);

        // Calculate total with null/undefined safety
        const total = logsData.reduce((sum, log) => {
          const hours = log.hoursUsed || 0;
          const rate = log.rate || 0;
          return sum + hours * rate;
        }, 0);
        setTotalAmount(total);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error loading data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [siteId]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  // ✅ Handle site status update
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    try {
      const res = await fetch(`http://localhost:5000/api/sites/${siteId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      setSite((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error(err);
      alert('Error updating site status');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Site Logs & Billing</h2>

      {loading && <p className="text-center text-gray-500">Loading data...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && site && (
        <div className="mb-6 bg-gray-100 p-4 rounded shadow">
          <p><strong>Site:</strong> {site.siteName}</p>
          <p><strong>Contractor:</strong> {site.contractorName}</p>
          <p><strong>Location:</strong> {site.location}</p>

          <div className="mt-2">
            <strong>Status:</strong>
            <select
              value={site.status}
              onChange={handleStatusChange}
              className="ml-2 p-1 border rounded"
            >
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      )}

      {/* ✅ Download Button */}
      {!loading && logs.length > 0 && (
        <div className="mb-4 text-right">
          <button
            onClick={() => window.open(`http://localhost:5000/api/dailylogs/download/${siteId}`, '_blank')}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Download Billing (Excel)
          </button>
        </div>
      )}

      {!loading && logs.length === 0 && (
        <p className="text-center text-gray-600">No logs available for this site.</p>
      )}

      {!loading && logs.length > 0 && (
        <table className="w-full table-auto border border-gray-300 shadow">
          <caption className="text-left p-2 text-gray-600 font-medium">Daily Usage Logs</caption>
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Machine</th>
              <th className="p-2 border">Hours Used</th>
              <th className="p-2 border">Rate (Rs/hr)</th>
              <th className="p-2 border">Amount (Rs)</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} className="text-center">
                <td className="p-2 border">
                  {new Date(log.date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="p-2 border">{log.machineType}</td>
                <td className="p-2 border">{log.hoursUsed || 0}</td>
                <td className="p-2 border">{formatCurrency(log.rate || 0)}</td>
                <td className="p-2 border">
                  {formatCurrency((log.hoursUsed || 0) * (log.rate || 0))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && logs.length > 0 && (
        <div className="text-right mt-4 text-lg font-semibold">
          Total Amount: {formatCurrency(totalAmount)}
        </div>
      )}
    </div>
  );
}

export default SiteLogs;
