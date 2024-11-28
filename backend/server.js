const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

// Test DB connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database');
});

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to Wings Cafe Stock Inventory API');
});

// Add a new product
app.post('/products', (req, res) => {
    const { name, description, category, price, quantity } = req.body;
    const query = 'INSERT INTO products (name, description, category, price, quantity) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, description, category, price, quantity], (err, result) => {
        if (err) {
            console.error('Error adding product:', err);
            return res.status(500).send('Server error');
        }
        res.status(201).json({ id: result.insertId, name, description, category, price, quantity });
    });
});

// Update a product
app.put('/products/:id', (req, res) => {
    const { name, description, category, price, quantity } = req.body;
    const { id } = req.params;
    const query = 'UPDATE products SET name = ?, description = ?, category = ?, price = ?, quantity = ? WHERE id = ?';
    db.query(query, [name, description, category, price, quantity, id], (err) => {
        if (err) {
            console.error('Error updating product:', err);
            return res.status(500).send('Server error');
        }
        res.status(200).send('Product updated successfully');
    });
});

// Fetch all products
app.get('/products', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).send('Server error');
        }
        res.status(200).json(result);
    });
});

// Sell a product
app.put('/products/sell/:id', (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    // Reduce product quantity in the database
    const query = 'UPDATE products SET quantity = quantity - ? WHERE id = ? AND quantity >= ?';
    db.query(query, [quantity, id, quantity], (err, result) => {
        if (err) {
            console.error('Error selling product:', err);
            return res.status(500).send('Server error');
        }
        if (result.affectedRows === 0) {
            return res.status(400).send('Insufficient stock or invalid product ID');
        }

        // Log the sale as a transaction
        const transactionQuery = 'INSERT INTO transactions (product_id, transaction_type, quantity, date) VALUES (?, ?, ?, ?)';
        const currentDate = new Date(); // Get current date and time
        db.query(transactionQuery, [id, 'sold', quantity, currentDate], (err) => {
            if (err) {
                console.error('Error logging transaction:', err);
                return res.status(500).send('Server error');
            }
            res.status(200).send('Product sold and transaction recorded');
        });
    });
});
// Delete a product
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;

    // Log the deletion as a transaction before deleting the product
    const transactionQuery = 'INSERT INTO transactions (product_id, transaction_type, quantity, date) VALUES (?, ?, ?, ?)';
    const currentDate = new Date();
    db.query(transactionQuery, [id, 'deleted', 0, currentDate], (err) => {
        if (err) {
            console.error('Error logging delete transaction:', err);
            return res.status(500).send('Server error');
        }

        // Proceed to delete the product after logging
        const deleteQuery = 'DELETE FROM products WHERE id = ?';
        db.query(deleteQuery, [id], (err, result) => {
            if (err) {
                console.error('Error deleting product:', err);
                return res.status(500).send('Server error');
            }

            if (result.affectedRows === 0) {
                return res.status(404).send('Product not found');
            }

            res.status(200).send('Product deleted and transaction recorded');
        });
    });
});

// Add a transaction (for other types of transactions)
app.post('/transactions', (req, res) => {
    const { product_id, transaction_type, quantity } = req.body;
    const query = 'INSERT INTO transactions (product_id, transaction_type, quantity) VALUES (?, ?, ?)';
    db.query(query, [product_id, transaction_type, quantity], (err, result) => {
        if (err) {
            console.error('Error adding transaction:', err);
            return res.status(500).send('Server error');
        }
        res.status(201).json({ id: result.insertId, product_id, transaction_type, quantity });
    });
});

// Fetch all transactions
app.get('/transactions', (req, res) => {
    const query = 'SELECT * FROM transactions';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching transactions:', err);
            return res.status(500).send('Server error');
        }
        res.status(200).json(result);
    });
});

// Add new user
app.post('/users', (req, res) => {
    const { username, email, password } = req.body;
  
    // Check if the username or email already exists
    const checkQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.query(checkQuery, [username, email], (err, result) => {
      if (err) {
        console.error('Error checking username/email:', err);
        return res.status(500).send('Server error');
      }
  
      // If a user with the same username or email exists, return an error
      if (result.length > 0) {
        return res.status(400).send('Sign-up failed. Username or email might already exist.');
      }
  
      // Proceed to add the new user
      const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(query, [username, email, password], (err, result) => {
        if (err) {
          console.error('Error adding user:', err);
          return res.status(500).send('Server error');
        }
        res.status(201).json({ id: result.insertId, username, email });
      });
    });
  });
  
  // Get all users
  app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error fetching users:', err);
        return res.status(500).send('Server error');
      }
      res.status(200).json(result);
    });
  });
  
  // Update a user
  app.put('/users/:id', (req, res) => {
    const { username, email, password } = req.body; // Removed role
    const { id } = req.params;
    const query = 'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?';
    db.query(query, [username, email, password, id], (err) => {
      if (err) {
        console.error('Error updating user:', err);
        return res.status(500).send('Server error');
      }
      res.status(200).send('User updated successfully');
    });
  });
  
  // Delete a user
  app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';
    db.query(query, [id], (err) => {
      if (err) {
        console.error('Error deleting user:', err);
        return res.status(500).send('Server error');
      }
      res.status(200).send('User deleted successfully');
    });
  });

// Verify login credentials
app.post('/users/login', (req, res) => {
    const { username, password } = req.body;
  
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, result) => {
      if (err) {
        console.error('Error logging in:', err);
        return res.status(500).send('Server error');
      }
      
      if (result.length > 0) {
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).send('Invalid username or password');
      }
    });
  });
  
  
// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
