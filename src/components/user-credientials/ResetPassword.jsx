import React, { useState, useEffect } from 'react';
import { TextField, Button, IconButton, InputAdornment, ThemeProvider, createTheme, CircularProgress } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import '../css/reset-password.css';

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(100, 108, 255)',
    },
  },
});

export default function ResetPassword() {
  const base_url = import.meta.env.VITE_URL || 'http://localhost:8080';
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Invalid reset link');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${base_url}/resetpassword`, { token, password });
      setMessage(response.data.message);
      setError('');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
      setMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="reset-password-container">
        <div className="reset-password-content">
          <div className="reset-password-header">
            <h1>Reset Your Password</h1>
            <p>Enter your new password below</p>
          </div>
          <form onSubmit={handleSubmit} className="reset-password-form">
            <TextField
              fullWidth
              variant="outlined"
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              disabled={isLoading}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              disabled={isLoading}
            />
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}
            <Button
              variant="contained"
              fullWidth
              type="submit"
              className="reset-password-button"
              disabled={!token || isLoading}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={24} color="inherit" />
                  <span style={{ marginLeft: '10px' }}>Resetting...</span>
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
          <div className="reset-password-options">
            <p className="login-prompt">
              Remember your password? <Link to="/login">Log In</Link>
            </p>
          </div>
        </div>
        <div className="reset-password-image">
          <div className="image-overlay">
            <h2>Set Your New Password on <span>Mr.</span> Blogs</h2>
            <p>Choose a strong password to keep your account secure</p>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}