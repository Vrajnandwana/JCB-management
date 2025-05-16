import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateSite from './pages/CreateSite';
import AddDailyLog from './pages/AddDailyLog';
import SiteLogs from './pages/SiteLogs';
import FuelTracker from './pages/FuelTracker'; // ✅ import
import MainLayout from './layout/MainLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      {/* Routes with Sidebar & Navbar */}
      <Route
        path="/dashboard"
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        }
      />
      <Route
        path="/create-site"
        element={
          <MainLayout>
            <CreateSite />
          </MainLayout>
        }
      />
      <Route
        path="/daily-log"
        element={
          <MainLayout>
            <AddDailyLog />
          </MainLayout>
        }
      />
      <Route
        path="/logs/:siteId"
        element={
          <MainLayout>
            <SiteLogs />
          </MainLayout>
        }
      />
      <Route
        path="/fuel-tracker"
        element={
          <MainLayout>
            <FuelTracker />
          </MainLayout>
        }
      />
    </Routes>
  );
}

export default App;
