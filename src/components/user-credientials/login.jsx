import React, { useState } from 'react';
import { TextField, Button, IconButton, InputAdornment, ThemeProvider, createTheme } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Cookies from 'js-cookie';
import { set_user_info } from "../state";
import { Visibility, VisibilityOff, LockOutlined, EmailOutlined } from '@mui/icons-material';
import '../css/login.css';

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(100, 108, 255)',
    },
  },
});

export default function Signin() {
  const base_url = import.meta.env.VITE_URL || 'http://localhost:8080';
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${base_url}/login`, formData);
      const { info, accessToken, refreshToken } = response.data;
      const { username, id, profile_pic } = info;

      Cookies.set('accessToken', accessToken, {
        expires: 7,
        sameSite: 'strict',
        secure: true,
      });

      Cookies.set('refreshToken', refreshToken, {
        expires: 30,
        sameSite: 'strict',
      });

      dispatch(set_user_info({ username, id, profile_pic, accessToken, refreshToken }));
      navigate('/');
    } catch (err) {
      setError('Incorrect email or password');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="login-container">
        <div className="login-content">
          {/* <div className="branding">
            <div className="logo">Mr. Blogs</div>
          </div> */}
          <div className="login-header">
            <h1>Welcome Back!</h1>
            <p>Log in to continue your journey with Mr. Blogs</p>
          </div>
          <form onSubmit={handleSubmit} className="login-form">
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
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
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && <p className="error-message">{error}</p>}
            <Button
              variant="contained"
              fullWidth
              type="submit"
              className="login-button"
            >
              Log In
            </Button>
          </form>
          <div className="login-options">
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
            <p className="signup-prompt">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </div>
        <div className="login-image">
          {/* <img src="pxfuel.jpg" alt="Mr. Blogs" /> */}
          <div className="image-overlay">
            <h2>Share Your Story on <span>Mr.</span>  Blogs</h2>
            <p>Join our community of passionate writers and readers</p>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}