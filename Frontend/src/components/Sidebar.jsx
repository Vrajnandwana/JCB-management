import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi'; // Menu icons

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Navbar */}
      <div className="md:hidden flex justify-between items-center bg-blue-600 text-white p-4">
        <h2 className="text-lg font-semibold">JCB Manager</h2>
        <button onClick={toggleMenu}>
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar Menu */}
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } md:block bg-gray-100 p-4 md:w-64 min-h-screen shadow-md`}
      >
        <h2 className="text-xl font-bold text-blue-600 mb-4 hidden md:block">JCB Manager</h2>
        <ul className="space-y-3 text-gray-700">
          <li>
            <Link to="/dashboard" className="block hover:text-blue-600">Dashboard</Link>
          </li>
          <li>
            <Link to="/create-site" className="block hover:text-blue-600">Create Site</Link>
          </li>
          <li>
            <Link to="/daily-log" className="block hover:text-blue-600">Add Daily Log</Link>
          </li>
          <li>
            <Link to="/fuel-tracker" className="block hover:text-blue-600">Fuel Tracker</Link>
          </li>
          <li>
            <Link to="/login" className="block hover:text-blue-600">Login</Link> {/* Added Login link */}
          </li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
