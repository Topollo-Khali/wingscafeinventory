import React, { useState, useEffect } from 'react';
import './styles.css'; 

function Dashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    setProducts(storedProducts); 
  }, []);

  return (
    <div>
      <h1>Product List</h1>
      <section id="product-list">
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <table id="product-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td>{product.productName}</td>
                  <td>{product.description}</td>
                  <td>{product.category}</td>
                  <td>{product.price}</td>
                  <td>{product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default Dashboard;