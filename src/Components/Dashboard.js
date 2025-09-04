import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>
      <button onClick={() => navigate('/request')} style={btnStyle}>New Form</button>
      <button onClick={() => navigate('/certification')} style={btnStyle}>Certification</button>
      <button onClick={() => navigate('/approval')} style={btnStyle}>Approval</button>
      <button onClick={() => navigate('/register')} style={btnStyle}>Register</button>
      <button onClick={() => navigate('/login')} style={btnStyle}>Login</button>
      <button onClick={() => navigate('/admin')} style={btnStyle}>Admin</button>

    </div>
  );
};

const btnStyle = {
  margin: '10px',
  padding: '10px 20px',
  border: 'none',
  background: '#2980b9',
  color: 'white',
  borderRadius: 5,
  cursor: 'pointer'
};

export default Dashboard;
