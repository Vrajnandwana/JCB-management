import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

function MainLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
