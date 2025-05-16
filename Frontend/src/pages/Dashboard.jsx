import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [sites, setSites] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/sites')
      .then(res => res.json())
      .then(data => {
        console.log("Fetched sites:", data); // ✅ Log fetched sites for debugging
        setSites(data);
      })
      .catch(err => console.error('Error fetching sites:', err));
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">All Sites</h2>

      {sites.length === 0 ? (
        <p className="text-gray-600 text-center">No sites available</p>
      ) : (
        <table className="w-full table-auto border border-gray-300 shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Site Name</th>
              <th className="p-2 border">Contractor</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border">Machines</th>
              <th className="p-2 border">Start Date</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Logs</th>
            </tr>
          </thead>
          <tbody>
            {sites.map((site) => (
              <tr key={site._id || site.id} className="text-center">
                <td className="p-2 border">{site.siteName || '-'}</td>
                <td className="p-2 border">{site.contractorName || '-'}</td>
                <td className="p-2 border">{site.location || '-'}</td>
                <td className="p-2 border">
                  {site.machines && site.machines.length > 0
                    ? site.machines.map((m) => m.type).join(', ')
                    : '—'}
                </td>
                <td className="p-2 border">
                  {site.startDate
                    ? new Date(site.startDate).toLocaleDateString()
                    : '—'}
                </td>
                <td className="p-2 border">{site.status || '-'}</td>
                <td className="p-2 border">
  {site._id ? (
    <>
      <Link to={`/logs/${site._id}`} className="text-blue-600 underline mr-2">
        View Logs
      </Link>
      <Link to={`/daily-log?siteId=${site._id}`} className="text-green-600 underline">
        Add Log
      </Link>
    </>
  ) : '—'}
</td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;
