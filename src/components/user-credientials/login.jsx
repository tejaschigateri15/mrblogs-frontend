// import React from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { set_user_info } from "../state";
import '../css/login.css'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import Cookies from 'js-cookie'


// import { set } from 'mongoose';


export default function Signin() {

  const base_url = import.meta.env.VITE_URL || 'http://localhost:8080';

  const dispatch = useDispatch()
  const user_info = useSelector((state) => state.username)

  // const [blog_id,setblog_id] = useContext(mycontext)

  const [formData, setFormData] = useState({

    email: '',
    password: '',
  });
  const asc = Cookies.get('accessToken')
  // console.log("sf", asc)


  const [yes, setYes] = useState(false);
  const [idd, setid] = useState([])

  const navigate = useNavigate();
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await axios.post(`${base_url}/login`, formData)
      // setid(response.data)
      // console.log("fdfdfdxxxx : ", response.data)
      const { info, accessToken, refreshToken } = response.data
      const { username, id, email, profile_pic } = info
      Cookies.set('accessToken', accessToken, {
        expires: 7, // Expires in 7 days
        // secure: process.env.NODE_ENV === 'production', // Set to true if you're using HTTPS
        sameSite: 'strict',
        secure: true,
        // httpOnly: true,
      });

      // Set the refresh token as a cookie
      Cookies.set('refreshToken', refreshToken, {
        expires: 30, // Expires in 30 days
        // secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      // console.log("vcvc", username, email, id, profile_pic, "\n\naccessToken", accessToken, "\n\nrefreshToken", refreshToken)
      dispatch(set_user_info({ username, id, profile_pic, accessToken, refreshToken })) // saving the info to the redux store
      if (response.status === 200) {
        const asc = Cookies.get('accessToken')
        // console.log("accessTokenxxxxxxxxx", asc)
        navigate('/');

      } else {
        setYes(true);
      }

      // console.log("login was correct", response.status);
    } catch (err) {
      console.log(err);
      setYes(true);
    }
  };

  const googleauth = async () => {

    try {
      console.log("google auth")
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider)
      console.log(user)
      navigate('/')

    } catch (err) {
      console.log(err)
    }

  }


  // const isError = formData.password.length < 10;
  return (
    <div>
      <div className="sign-up flex flex-row">
        <div className="content basis-1/2">
          <h2 className='ll text-center'>Dive into the Blogosphere with Us!</h2>
          <div className="form">
            <div className="contentt">
              <div className="inputsx">

                <TextField id="email" label="Email" variant="standard" InputLabelProps={{ style: { color: '#546e7a' } }} name='email' onChange={handleInputChange} />
                <TextField id="password" label="Password" variant="standard" type="password" InputLabelProps={{ style: { color: '#546e7a' } }}

                  onChange={handleInputChange}
                  error={yes}
                  helperText={yes ? 'Incorrect email or password' : ''}
                  name='password'
                />
                <Button variant="outlined" onClick={handlesubmit} className='login_btn'>Login</Button>
                {/* <Button className="Button" onClick={googleauth}>
                  <img width="48" height="48" src="https://img.icons8.com/color/48/google-logo.png" alt="google-logo" />
                  <span>Login as Google</span>
                </Button> */}
                <p className='log-in'>don't have an account? <Link to='/signup'><span className='singnup-btn mobile-signup'>Signup</span> </Link></p>
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
