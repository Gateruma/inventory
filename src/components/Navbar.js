import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav style={{
      backgroundImage: 'linear-gradient(rgba(34, 109, 58, 0.9), rgba(34, 109, 58, 0.9)), url("/dccbuilding.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <img 
          src="/dcclogo.png" 
          alt="DCC Logo" 
          style={{ height: '40px' }} 
        />
        <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
          Davao Central College Inventory System
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '8px 16px',
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid white',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Home
        </button>
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '8px 16px',
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid white',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </div>
    </nav>
  );
}

export default Navbar;