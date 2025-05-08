import React from 'react';
import { Link } from 'react-router-dom';

function Index() {
  return (
    <div className="index-container">
      <img src="/dcclogo.png" alt="DCC Logo" className="index-logo" />
      <h1 className="index-title">DCC Inventory Management System</h1>
      <p className="index-subtitle">Efficiently track and manage equipment across the campus</p>
      
      <div className="index-features">
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3 className="feature-title">Equipment Tracking</h3>
          <p>Keep track of all equipment with detailed information and status updates.</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🔍</div>
          <h3 className="feature-title">Quick Search</h3>
          <p>Find equipment quickly with powerful search and filtering capabilities.</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <h3 className="feature-title">User Management</h3>
          <p>Manage users and their access levels to maintain security.</p>
        </div>
      </div>
      
      <div className="index-cta">
        <Link to="/login" className="btn btn-primary">Login</Link>
        <Link to="/register" className="btn btn-secondary">Register</Link>
      </div>
    </div>
  );
}

export default Index;