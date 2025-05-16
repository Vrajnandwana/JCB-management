import React, { useState } from 'react';
import axios from 'axios';

function CreateSite() {
  const [formData, setFormData] = useState({
    siteName: '',
    contractorName: '',
    projectType: '',
    phone: '',
    location: '',
    startDate: '',
    siteStatus: 'Active',
    notes: '',
    machines: [{ type: '', hourlyRate: '' }],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMachineChange = (index, field, value) => {
    const newMachines = [...formData.machines];
    newMachines[index][field] = value;
    setFormData({ ...formData, machines: newMachines });
  };

  const addMachine = () => {
    setFormData({ ...formData, machines: [...formData.machines, { type: '', hourlyRate: '' }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/sites', formData);
      alert('Site created successfully!');
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert('Error creating site!');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-md shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Create New Site</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="siteName" placeholder="Site Name" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="text" name="contractorName" placeholder="Contractor Name" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="text" name="projectType" placeholder="Project Type" className="w-full p-2 border rounded" onChange={handleChange} />
        <input type="tel" name="phone" placeholder="Phone Number" className="w-full p-2 border rounded" onChange={handleChange} />
        <input type="text" name="location" placeholder="Location" className="w-full p-2 border rounded" onChange={handleChange} />
        <input type="date" name="startDate" className="w-full p-2 border rounded" onChange={handleChange} required />

        <select name="siteStatus" className="w-full p-2 border rounded" onChange={handleChange}>
          <option value="Active">Active</option>
          <option value="On Hold">On Hold</option>
          <option value="Completed">Completed</option>
        </select>

        <textarea name="notes" placeholder="Additional Notes" className="w-full p-2 border rounded" rows="3" onChange={handleChange} />

        <div>
          <h3 className="font-semibold mb-2">Assigned Machines</h3>
          {formData.machines.map((machine, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                placeholder="Machine Type (e.g., JCB)"
                value={machine.type}
                onChange={(e) => handleMachineChange(index, 'type', e.target.value)}
                className="p-2 border rounded"
                required
              />
              <input
                placeholder="Hourly Rate"
                type="number"
                value={machine.hourlyRate}
                onChange={(e) => handleMachineChange(index, 'hourlyRate', e.target.value)}
                className="p-2 border rounded"
                required
              />
            </div>
          ))}
          <button type="button" onClick={addMachine} className="bg-gray-200 px-3 py-1 rounded">
            + Add Machine
          </button>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreateSite;
