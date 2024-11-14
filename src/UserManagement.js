import React, { useState, useEffect } from 'react';
import { fetchUsers, addUser, updateUser, deleteUser } from './Api'; // Ensure the path is correct

function UserManagement() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersData = await fetchUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleAddOrUpdateUser = async (e) => {
    e.preventDefault();
    const newUser = { username, email, password };

    if (editUserId) {
      // Update existing user
      try {
        await updateUser(editUserId, newUser);
        setEditUserId(null);
      } catch (error) {
        console.error('Failed to update user:', error);
      }
    } else {
      // Add new user
      try {
        const addedUser = await addUser(newUser);
        setUsers([...users, addedUser]);
      } catch (error) {
        console.error('Failed to add user:', error);
      }
    }

    // Clear input fields and reload users
    setUsername('');
    setEmail('');
    setPassword('');
    loadUsers();
  };

  const handleEditUser = (user) => {
    setUsername(user.username);
    setEmail(user.email);
    setPassword(user.password);
    setEditUserId(user.id);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      
      // Update users state functionally to ensure it gets the latest users state
      setUsers((prevUsers) => prevUsers.filter(user => user.id !== userId));
  
      // Optional: Log to verify changes
      console.log('User deleted:', userId);
      console.log('Updated users list:', users);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  return (
    <div>
      <h1>User Management System</h1>
      <main>
        <section id="add-user">
          <h2>{editUserId ? 'Edit User' : 'Add New User'}</h2>
          <form id="user-form" onSubmit={handleAddOrUpdateUser}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username..."
              required
            />
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email..."
              required
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password..."
              required
            />
            <button type="submit">
              {editUserId ? 'Update User' : 'Add User'}
            </button>
          </form>
        </section>

        <section id="user-list">
          <h2>User List</h2>
          <table id="user-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td> {/* Display password for now */}
                  <td>
                    <button onClick={() => handleEditUser(user)}>Edit</button>
                    <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
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

export default UserManagement;
