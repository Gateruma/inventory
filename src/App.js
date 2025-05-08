import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import EquipmentList from './pages/EquipmentList';
import AdminDashboard from './pages/AdminDashboard';
import Users from './pages/Users';

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/equipment-list" element={<EquipmentList />} />
          <Route path="/products" element={<div>Products</div>} />
          <Route path="/categories" element={<div>Categories</div>} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
