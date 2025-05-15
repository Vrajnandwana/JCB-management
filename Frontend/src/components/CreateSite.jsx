import React, { useState } from 'react';

function CreateSite() {
  const [formData, setFormData] = useState({
    siteName: '',
    contractorName: '',
    projectType: '',
    phone: '',
    location: '',
    startDate: '',
    machines: [],
    hourlyRates: {
      JCB: '',
      Tractor: '',
      Breaker: '',
      Tanker: ''
    },
    siteStatus: 'Active',
    notes: ''
  });

  const machineOptions = ['JCB', 'Tractor', 'Breaker', 'Tanker'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.hourlyRates) {
      setFormData({
        ...formData,
        hourlyRates: { ...formData.hourlyRates, [name]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleMachineSelect = (e) => {
    const { value, checked } = e.target;
    let updatedMachines = [...formData.machines];

    if (checked) {
      updatedMachines.push(value);
    } else {
      updatedMachines = updatedMachines.filter(m => m !== value);
    }

    setFormData({ ...formData, machines: updatedMachines });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Later replace with backend API call
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-md shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Create New Site</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="siteName" placeholder="Site Name" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="text" name="contractorName" placeholder="Contractor Name" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="text" name="projectType" placeholder="Project Type" className="w-full p-2 border rounded" onChange={handleChange} />
        <input type="tel" name="phone" placeholder="Phone Number" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="date" name="startDate" className="w-full p-2 border rounded" onChange={handleChange} required />

        <div className="space-y-2">
          <label className="block font-semibold">Assign Machines</label>
          {machineOptions.map(machine => (
            <div key={machine}>
              <input type="checkbox" value={machine} onChange={handleMachineSelect} />
              <label className="ml-2">{machine}</label>
              <input
                type="number"
                name={machine}
                placeholder={`Hourly Rate for ${machine}`}
                className="ml-4 p-1 border rounded"
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        <select name="siteStatus" className="w-full p-2 border rounded" onChange={handleChange}>
          <option value="Active">Active</option>
          <option value="On Hold">On Hold</option>
          <option value="Completed">Completed</option>
        </select>

        <textarea name="notes" placeholder="Additional Notes" className="w-full p-2 border rounded" rows="3" onChange={handleChange} />

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreateSite;
