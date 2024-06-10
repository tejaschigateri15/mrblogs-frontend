import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Emailvalid from 'email-validator'


export default function Signup() {

  const base_url = import.meta.env.VITE_URL || 'http://localhost:8080';
  
  const url =`${base_url}/register`
  // console.log("url",url);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // console.log(formData);
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    try {
      const form = await axios.post(url, formData);
      navigate('/login')

    }
    catch (err) {
      console.log(err);
    }
   
  };

  const isError = formData.password.length < 10;
  return (
    <div>
      <div className="sign-up flex flex-row">
        <div className="content basis-1/2">
          <h2 className='ll text-center'>Dive into the Blogosphere with Us!</h2>
          <div className="form">
            <div className="contentt">
              <div className="inputsx">
                <TextField
                  id="firstname"
                  label="Username"
                  variant="standard"
                  name='username'
                  InputLabelProps={{ style: { color: '#546e7a' } }}
                  onChange={handleInputChange}
                />
                <TextField id="email" label="Email" variant="standard" InputLabelProps={{ style: { color: '#546e7a' } }} name='email' onChange={handleInputChange} />
                <TextField id="password" label="Password" variant="standard" type="password" InputLabelProps={{ style: { color: '#546e7a' } }}

                  onChange={handleInputChange}
                  error={isError}
                  helperText={isError ? 'Password must be at least 8 characters long' : ''}
                  name='password'
                />
                <Button variant="outlined" onClick={handlesubmit}>sign up</Button>
                <p className='log-in'>Already have an account? <Link to='/login'> login</Link></p>
              </div>
            </div>
          </div>
        </div>
        <div className="sideimage basis-1/2">
          <img src="login-image.jpg" alt="hello" className="h-screen w-full" />
        </div>
      </div>
    </div>
  );
}
