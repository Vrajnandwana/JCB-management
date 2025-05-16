import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [sites, setSites] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/sites')
      .then(res => res.json())
      .then(data => setSites(data))
      .catch(err => console.error('Error fetching sites:', err));
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-gray-800">All Sites</h2>

      {sites.length === 0 ? (
        <p className="text-gray-600 text-center">No sites available</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full border-collapse text-sm sm:text-base">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 border">Site Name</th>
                <th className="p-3 border">Contractor</th>
                <th className="p-3 border">Location</th>
                <th className="p-3 border">Machines</th>
                <th className="p-3 border">Start Date</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Logs</th>
              </tr>
            </thead>
            <tbody>
              {sites.map(site => (
                <tr
                  key={site._id || site.id}
                  className="text-center even:bg-gray-50 hover:bg-blue-50 transition"
                >
                  <td className="p-3 border whitespace-nowrap">{site.siteName || '-'}</td>
                  <td className="p-3 border whitespace-nowrap">{site.contractorName || '-'}</td>
                  <td className="p-3 border whitespace-nowrap">{site.location || '-'}</td>
                  <td className="p-3 border whitespace-nowrap">
                    {site.machines?.length
                      ? site.machines.map(m => m.type).join(', ')
                      : '—'}
                  </td>
                  <td className="p-3 border whitespace-nowrap">
                    {site.startDate
                      ? new Date(site.startDate).toLocaleDateString('en-IN')
                      : '—'}
                  </td>
                  <td className="p-3 border whitespace-nowrap">{site.status || '-'}</td>
                  <td className="p-3 border whitespace-nowrap">
                    {site._id && (
                      <div className="flex flex-col sm:flex-row sm:justify-center gap-2">
                        <Link
                          to={`/logs/${site._id}`}
                          className="text-blue-600 underline"
                        >
                          View Logs
                        </Link>
                        <Link
                          to={`/daily-log?siteId=${site._id}`}
                          className="text-green-600 underline"
                        >
                          Add Log
                        </Link>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
