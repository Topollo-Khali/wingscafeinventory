import React, { useState } from 'react';
import './styles.css';
import { addUser, logUser } from './Api';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between login and sign-up

  // Handle login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await logUser(username, password);
      if (response.message === 'Login successful') {
        onLogin(); // Proceed if login is successful
      }
    } catch (error) {
      alert('Invalid username or password');
    }
  };

  // Handle sign-up submission
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await addUser({ username, email, password });
      if (response) {
        alert('Sign-up successful! You can now log in.');
        setIsSignUp(false); // Switch back to login view
      }
    } catch (error) {
      alert('Sign-up failed. Username or email might already exist.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={isSignUp ? handleSignUpSubmit : handleLoginSubmit}>
        <div className="wrapper">
          <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          {isSignUp && (
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {isSignUp && (
            <div>
              <label>Confirm Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          <button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
          <p onClick={() => setIsSignUp(!isSignUp)} className="toggle">
            {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
