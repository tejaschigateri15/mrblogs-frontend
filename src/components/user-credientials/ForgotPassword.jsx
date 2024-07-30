import React, { useState } from 'react';
import { TextField, Button, InputAdornment, ThemeProvider, createTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { EmailOutlined } from '@mui/icons-material';
import '../css/forgot-password.css';

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(100, 108, 255)',
    },
  },
});

export default function ForgotPassword() {
  const base_url = import.meta.env.VITE_URL || 'http://localhost:8080';
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${base_url}/forgotpassword`, { email });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
      setMessage('');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="forgot-password-container">
        <div className="forgot-password-content">
          <div className="forgot-password-header">
            <h1>Forgot Password</h1>
            <p>Enter your email to receive a password reset link</p>
          </div>
          <form onSubmit={handleSubmit} className="forgot-password-form">
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined />
                  </InputAdornment>
                ),
              }}
            />
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}
            <Button
              variant="contained"
              fullWidth
              type="submit"
              className="forgot-password-button"
            >
              Send Reset Link
            </Button>
          </form>
          <div className="forgot-password-options">
            <p className="login-prompt">
              Remember your password? <Link to="/login">Log In</Link>
            </p>
          </div>
        </div>
        <div className="forgot-password-image">
          <div className="image-overlay">
            <h2 >Reset Your Password on <span>Mr.</span> Blogs</h2>
            <p>We'll help you get back to sharing your stories</p>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}