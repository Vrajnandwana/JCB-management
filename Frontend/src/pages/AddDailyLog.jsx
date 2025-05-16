import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function AddDailyLog() {
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [machineOptions, setMachineOptions] = useState([]);
  const [formData, setFormData] = useState({
    siteId: '',
    machineType: '',
    hoursUsed: '',
    rate: '',
    date: new Date().toISOString().split('T')[0],
  });

  const query = new URLSearchParams(useLocation().search);
  const preselectedSiteId = query.get('siteId');

  useEffect(() => {
    fetch('http://localhost:5000/api/sites')
      .then((res) => res.json())
      .then((data) => {
        setSites(data);
        // Preselect site if siteId exists in URL
        if (preselectedSiteId) {
          const found = data.find((s) => s._id === preselectedSiteId);
          if (found) {
            setSelectedSite(found);
            setFormData((prev) => ({ ...prev, siteId: found._id }));
            setMachineOptions(found.machines || []);
          }
        }
      })
      .catch((err) => console.error('Error fetching sites:', err));
  }, [preselectedSiteId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If site changes
    if (name === 'siteId') {
      const site = sites.find((s) => s._id === value);
      setSelectedSite(site);
      setMachineOptions(site?.machines || []);
    }

    // If machine changes
    if (name === 'machineType') {
      const selectedMachine = machineOptions.find((m) => m.type === value);
      const rate = selectedMachine?.hourlyRate || '';
      setFormData((prev) => ({ ...prev, rate, machineType: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/dailylogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Log saved!');
        setFormData({
          siteId: selectedSite?._id || '',
          machineType: '',
          hoursUsed: '',
          rate: '',
          date: new Date().toISOString().split('T')[0],
        });
      } else {
        const error = await res.json();
        alert('Error: ' + error.message);
      }
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto mt-8 bg-gray-50 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Add Daily Log Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Site Select */}
        <div>
          <label>Site</label>
          <select
            name="siteId"
            value={formData.siteId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Site</option>
            {sites.map((site) => (
              <option key={site._id} value={site._id}>
                {site.siteName}
              </option>
            ))}
          </select>
        </div>

        {/* Machine Type */}
        <div>
          <label>Machine Type</label>
          <select
            name="machineType"
            value={formData.machineType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Machine</option>
            {machineOptions.map((m, i) => (
              <option key={i} value={m.type}>
                {m.type} (Rs {m.hourlyRate}/hr)
              </option>
            ))}
          </select>
        </div>

        {/* Hours */}
        <div>
          <label>Hours Used</label>
          <input
            type="number"
            name="hoursUsed"
            value={formData.hoursUsed}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            min="0"
          />
        </div>

        {/* Rate */}
        <div>
          <label>Rate (per hour)</label>
          <input
            type="number"
            name="rate"
            value={formData.rate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            readOnly
          />
        </div>

        {/* Date */}
        <div>
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Log
        </button>
      </form>
    </div>
  );
}

export default AddDailyLog;
