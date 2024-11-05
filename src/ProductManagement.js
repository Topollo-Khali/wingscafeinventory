import React, { useState, useEffect } from 'react';
import './styles.css';

function ProductManagement() {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [products, setProducts] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem('products');
    console.log("Data retrieved from local storage:", storedData); // Log retrieved data

    try {
      const storedProducts = JSON.parse(storedData) || [];
      console.log("Parsed products:", storedProducts); // Log parsed products array
      setProducts(storedProducts);
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      localStorage.setItem('products', JSON.stringify([]));
      setProducts([]);
    }
  }, []);

  const handleAddProduct = (e) => {
    e.preventDefault();
    const newProduct = { productName, description, category, price, quantity };
    let updatedProducts;

    if (editIndex !== null) {
      updatedProducts = [...products];
      updatedProducts[editIndex] = newProduct;
      setEditIndex(null);
    } else {
      updatedProducts = [...products, newProduct];
    }

    setProducts(updatedProducts);
    console.log("Data to be stored in local storage:", updatedProducts); // Log data to store
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    setProductName('');
    setDescription('');
    setCategory('');
    setPrice('');
    setQuantity('');
  };

  const handleEditProduct = (index) => {
    setProductName(products[index].productName);
    setDescription(products[index].description);
    setCategory(products[index].category);
    setPrice(products[index].price);
    setQuantity(products[index].quantity);
    setEditIndex(index);
  };

  const handleDeleteProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  return (
    <div>
      <h1>Inventory System</h1>
      <main>
        <div className="wrapper">
          <section id="add-product">
            <h2>{editIndex !== null ? 'Edit Product' : 'Add New Product'}</h2>
            <form id="product-form" onSubmit={handleAddProduct}>
              <label htmlFor="product-name">Product Name:</label>
              <input 
                type="text" id="product-name" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Enter product..." required 
              />
              <label htmlFor="description">Description:</label>
              <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description..." required 
              />
              <label htmlFor="category">Category:</label>
              <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category..." required 
              />
              <label htmlFor="price">Price:</label>
              <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="M000.00" required 
              />
              <label htmlFor="quantity">Initial Quantity:</label>
              <input 
                type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required 
              />
              <button type="submit">{editIndex !== null ? 'Update Product' : 'Add Product'}</button>
            </form>
          </section>
        </div>

        <section id="product-list">
          <h2>Product List</h2>
          <table id="product-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Actions</th>
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
                  <td>
                    <button onClick={() => handleEditProduct(index)}>Edit</button>
                    <button onClick={() => handleDeleteProduct(index)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default ProductManagement;
