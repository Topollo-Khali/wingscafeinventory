import React, { useState } from 'react';
// import './styles.css';
import UserManagement from './UserManagement'; // Import UserManagement component

function Login() {
  const [managername, setManagername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Direct login logic
    setIsLoggedIn(true); // Assume successful login
  };

  return (
    <div className="wrapper">
      {!isLoggedIn ? (
        <div>
          <h2>Manager</h2>
          <form onSubmit={handleLogin}>
            <label htmlFor="managername">Manager Name:</label>
            <input
              type="text"
              id="managername"
              placeholder="Manager Name..."
              value={managername}
              onChange={(e) => setManagername(e.target.value)}
              required
            /><br />

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            /><br />

            <button type="submit">Login</button>
          </form>
        </div>
      ) : (
        <UserManagement /> 
      )}
    </div>
  );
}

export default Login;
