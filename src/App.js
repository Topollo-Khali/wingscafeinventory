import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import './styles.css';
import Login from './Login';
import UserManagement from './UserManagement';
import ProductManagement from './ProductManagement';
import Dashboard from './Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="app-container">
        {/* Show login page if not authenticated, else show navigation and routes */}
        {!isAuthenticated ? (
          <Routes>
            <Route path="/" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
            {/* Redirect all paths to login if not authenticated */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <>
            {/* Display navigation after login */}
            <nav>
              <h2>Welcome to Wings Cafe</h2>
              <ul className="button-list">
                <li>
                  <Link to="/userManagement">
                    <button className="app-button">User Management</button>
                  </Link>
                </li>
                <li>
                  <Link to="/productManagement">
                    <button className="app-button">Product Management</button>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard">
                    <button className="app-button">Dashboard</button>
                  </Link>
                </li>
              </ul>
            </nav>
            {/* Routes for authenticated content */}
            <Routes>
              <Route path="/userManagement" element={<UserManagement />} />
              <Route path="/productManagement" element={<ProductManagement />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Redirect to User Management or any default page after login */}
              <Route path="*" element={<Navigate to="/userManagement" />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
