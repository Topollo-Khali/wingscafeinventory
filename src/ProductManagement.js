import React, { useState, useEffect } from 'react';
import './styles.css';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from './Api'; // Adjust import paths as needed

function ProductManagement() {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [products, setProducts] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // Fetch products on component mount
  useEffect(() => {
    fetchProductsAndSetState();
  }, []);

  // Function to fetch products from the backend
  const fetchProductsAndSetState = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Function to handle adding or updating a product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const newProduct = { name: productName, description, category, price, quantity };

    if (editIndex !== null) {
      // Update product
      try {
        const updatedProduct = await updateProduct(products[editIndex].id, newProduct);
        const updatedProducts = [...products];
        updatedProducts[editIndex] = updatedProduct;
        setProducts(updatedProducts);
        setEditIndex(null);
      } catch (error) {
        console.error('Error updating product:', error);
      }
    } else {
      // Add new product
      try {
        const addedProduct = await addProduct(newProduct);
        setProducts([...products, addedProduct]);
      } catch (error) {
        console.error('Error adding product:', error);
      }
    }

    // Clear form fields
    setProductName('');
    setDescription('');
    setCategory('');
    setPrice('');
    setQuantity('');
  };

  // Function to handle editing a product
  const handleEditProduct = (index) => {
    setProductName(products[index].name);
    setDescription(products[index].description);
    setCategory(products[index].category);
    setPrice(products[index].price);
    setQuantity(products[index].quantity);
    setEditIndex(index);
  };

  // Function to handle deleting a product
  const handleDeleteProduct = async (index) => {
    try {
      await deleteProduct(products[index].id); // Deleting from the backend
      // Remove the product immediately from the list after deletion
      const updatedProducts = products.filter((_, i) => i !== index);
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Function to handle selling a product
  const handleSellProduct = async (index) => {
    const updatedProducts = [...products];
    const product = updatedProducts[index];

    if (product.quantity > 0) {
      product.quantity -= 1; // Decrease the quantity immediately

      try {
        await updateProduct(product.id, product); // Update quantity in the backend
        setProducts(updatedProducts); // Update state to reflect the immediate change
      } catch (error) {
        console.error('Error selling product:', error);
      }
    }
  };

  return (
    <div>
      <h1>Inventory System</h1>
      <main>
        <section id="add-product">
          <h2>{editIndex !== null ? 'Edit Product' : 'Add New Product'}</h2>
          <form id="product-form" onSubmit={handleAddProduct}>
            <label htmlFor="product-name">Product Name:</label>
            <input type="text" id="product-name" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Enter product..." required />
            <label htmlFor="description">Description:</label>
            <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description..." required />
            <label htmlFor="category">Category:</label>
            <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category..." required />
            <label htmlFor="price">Price:</label>
            <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="M000.00" required />
            <label htmlFor="quantity">Initial Quantity:</label>
            <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            <button type="submit">{editIndex !== null ? 'Update Product' : 'Add Product'}</button>
          </form>
        </section>

        <section id="product-list">
          <h2>STOCK MANAGEMENT</h2>
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
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.category}</td>
                  <td>{product.price}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <button onClick={() => handleEditProduct(index)}>Edit</button>
                    <button onClick={() => handleDeleteProduct(index)}>Delete</button>
                    <button onClick={() => handleSellProduct(index)} disabled={product.quantity === 0}>
                      Sell
                    </button>
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
