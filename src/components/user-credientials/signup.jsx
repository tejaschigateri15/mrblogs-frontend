import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Emailvalid from 'email-validator'
import { createTheme, IconButton, InputAdornment, ThemeProvider } from '@mui/material';
import { EmailOutlined, LockOutlined, Person2Outlined, VerifiedUserOutlined, Visibility, VisibilityOff } from '@mui/icons-material';


export default function Signup() {

  const base_url = import.meta.env.VITE_URL || 'http://localhost:8080';

  const [showPassword, setShowPassword] = useState(false);

  const theme = createTheme({
    palette: {
      primary: {
        main: 'rgb(100, 108, 255)',
      },
    },
  });

  const [error, setError] = useState('');

  const url = `${base_url}/register`
  // console.log("url",url);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    // console.log(formData);
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    console.log("Signup details",formData);
    try {
      const form = await axios.post(url, formData);
      if (form.status === 200){

        navigate('/login')
      }
      else{
        setError('Username or Email already exists');
      }
    }
    catch (err) {
      console.log(err);
      setError('Something went wrong');
    }

  };

  // const isError = formData.password.length < 10;
  return (
    <ThemeProvider theme={theme}>
      <div className="login-container">
        <div className="login-content">
          {/* <div className="branding">
            <div className="logo">Mr. Blogs</div>
          </div> */}
          <div className="login-header">
            <h1>Create Your Account</h1>
            <p>Join Mr. Blogs today and start your journey with us.</p>
          </div>

          <form onSubmit={handlesubmit} className="login-form">
            {/* for username */}
            <TextField
              fullWidth
              variant="outlined"
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person2Outlined />
                  </InputAdornment>
                ),
              }} />


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
              Sign Up
            </Button>
          </form>
          <div className="login-options">
            {/* <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link> */}
            <p className="signup-prompt">
              {/* Don't have an account? <Link to="/signup">Sign Up</Link> */}
              Already have an account? <Link to="/login">Log In</Link>
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
