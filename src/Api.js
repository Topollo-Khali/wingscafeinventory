const API_URL = 'http://localhost:5000'; // Backend base URL

// Fetch all products
export const fetchProducts = async () => {
  const response = await fetch(`${API_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

// Add a new product and log transaction
export const addProduct = async (product) => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    throw new Error('Failed to add product');
  }
  const addedProduct = await response.json();

  // Log the 'added' transaction
  await logTransaction(addedProduct.product_id, 'added');
  return addedProduct;
};


// Update a product and log transaction
export const updateProduct = async (id, updatedProduct) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedProduct),
  });
  if (!response.ok) {
    throw new Error('Failed to update product');
  }
  const updated = await response.json();

  // Log the 'edited' transaction
  await logTransaction(id, 'edited');
  return updated;
};

// Delete a product and log transaction
export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete product');
  }

  return response.json();
  const deletedProduct = await response.json();

  // Log the 'deleted' transaction
  await logTransaction(id, 'deleted');
  return deletedProduct;
};

// Sell a product and log transaction
export const sellProduct = async (id, quantitySold) => {
  const response = await fetch(`${API_URL}/products/sell/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity: quantitySold }),
  });
  if (!response.ok) {
    throw new Error('Failed to sell product');
  }
  const soldProduct = await response.json();

  // Log the 'sold' transaction
  await logTransaction(id, 'sold', quantitySold);
  return soldProduct;
};

// Fetch all users
export const fetchUsers = async () => {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};
// Login a user
export const logUser = async (username, password) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid username or password');
  }

  return response.json();
};


// Add a new user
export const addUser = async (user) => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error('Failed to add user');
  }
  return response.json();
};

// Update a user
export const updateUser = async (id, updatedUser) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedUser),
  });
  if (!response.ok) {
    throw new Error('Failed to update user');
  }
  return response.json();
};

// Delete a user
export const deleteUser = async (id) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
  return response.json();
};

// Log a transaction
export const logTransaction = async (productId, transactionType, quantity = null) => {
  const response = await fetch(`${API_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: productId,
      transaction_type: transactionType,
      quantity: quantity,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to log transaction');
  }
  return response.json();
};
// User login
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
  });

  if (!response.ok) {
      throw new Error('Invalid username, email, or password');
  }
  return response.json();
};