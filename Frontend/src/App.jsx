import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateSite from './pages/CreateSite';
import AddDailyLog from './pages/AddDailyLog';
import SiteLogs from './pages/SiteLogs';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create-site" element={<CreateSite />} />
      <Route path="/daily-log" element={<AddDailyLog />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/logs/:siteId" element={<SiteLogs />} />
    </Routes>
  );
}

export default App;
