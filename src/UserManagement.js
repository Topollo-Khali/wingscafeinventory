import React, { useState, useEffect } from 'react';
import './styles.css'; 

function UserManagement() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null); 

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(storedUsers); 
  }, []);

  const handleAddUser = (e) => {
    e.preventDefault();
    const newUser = { username, email, role };

    if (editIndex !== null) {
      // Update user
      const updatedUsers = [...users];
      updatedUsers[editIndex] = newUser;
      setUsers(updatedUsers);
      setEditIndex(null); 
    } else {
      setUsers([...users, newUser]);
    }
    localStorage.setItem('users', JSON.stringify([...users, newUser]));

    setUsername('');
    setEmail('');
    setRole('');
  };

  const handleEditUser = (index) => {
    setUsername(users[index].username);
    setEmail(users[index].email);
    setRole(users[index].role);
    setEditIndex(index);
  };

  const handleDeleteUser = (index) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
    // Update localStorage
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  return (
    <div>
      <h1>User Management System</h1>
      <main>
          <section id="add-user">
            <h2>{editIndex !== null ? 'Edit User' : 'Add New User'}</h2>
            <form id="user-form" onSubmit={handleAddUser}>
              <label htmlFor="username">Username:</label>
              <input 
                type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username..." required 
              />
              <label htmlFor="email">Email:</label>
              <input 
                type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email..." required 
              />
              <label htmlFor="role">Role:</label>
              <input 
                type="text" id="role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role..." required 
              />
              <button type="submit">{editIndex !== null ? 'Update User' : 'Add User'}</button>
            </form>
          </section>
        
        <section id="user-list">
          <h2>User List</h2>
          <table id="user-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleEditUser(index)}>Edit</button>
                    <button onClick={() => handleDeleteUser(index)}>Delete</button>
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