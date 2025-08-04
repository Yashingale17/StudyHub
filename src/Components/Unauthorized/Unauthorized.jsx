import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className='mt-80' style={{ padding: 30, textAlign: 'center' }}>
      <h1>Unauthorized Access</h1>
      <p>You do not have permission to view this page.</p>
      <button
        onClick={() => navigate('/')}
        style={{
          marginTop: 20,
          padding: '10px 20px',
          cursor: 'pointer',
          backgroundColor: '#553CDF',
          color: 'white',
          border: 'none',
          borderRadius: 4,
        }}
      >
        Go to Home
      </button>
    </div>
  );
};

export default Unauthorized;
