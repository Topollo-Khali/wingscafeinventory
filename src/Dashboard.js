// Dashboard.js

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { fetchProducts } from './Api'; // Adjust the import path as needed
import './dashboard.css'; // Import CSS for rotating images

Chart.register(...registerables);

function Dashboard() {
  const [products, setProducts] = useState([]);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProductsAndSetState = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProductsAndSetState();
  }, []);

  // Prepare data for the bar chart
  const chartData = {
    labels: products.map(product => product.name),
    datasets: [
      {
        label: 'Quantity',
        data: products.map(product => product.quantity),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows for more control over size in CSS
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantity',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Products',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="dashboard-container">
      <h1>Product Quantity Chart</h1>
      <div className="chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Rotating Images Section */}
      <div className="image-container">
        <img src="images/switch.jpg" alt="Image 1" className="rotating-image" />
        <img src="images/apple.jfif" alt="Image 2" className="rotating-image" />
        <img src="images/pop.jfif" alt="Image 3" className="rotating-image" />
      </div>
    </div>
  );
}

export default Dashboard;