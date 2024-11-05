import React, { useState } from 'react';
import './styles.css';
import Login from './Login';
import UserManagement from './UserManagement';
import ProductManagement from './ProductManagement';
import Dashboard from './Dashboard'; 

function HomePage() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <UserManagement />;
      case 'userManagement':
        return <Login />;
      case 'productManagement':
        return <ProductManagement />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return (
          <div>
            <div>
          <div className="homepage-container">
            <h2>Welcome to Wings Cafe</h2>
            <nav>
              <ul className="button-list">
                <li>
                  <button className="homepage-button" onClick={() => setCurrentPage('userManagement')}>User Management</button>
                </li>
                <li>
                  <button className="homepage-button" onClick={() => setCurrentPage('productManagement')}>Product Management</button>
                </li>
                <li>
                  <button className="homepage-button" onClick={() => setCurrentPage('dashboard')}>Dashboard</button>
                </li>
              </ul>
            </nav>
          </div>
          </div>
          </div>
        );
    }
  };

  return (
    <div>
      {renderPage()}
    </div>
  );
}

export default HomePage;