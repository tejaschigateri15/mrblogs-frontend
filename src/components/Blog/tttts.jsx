import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPen } from '@fortawesome/free-solid-svg-icons';
import '../css/module.css'
// import '../css/testing.css'
import image from '/batman-svgrepo-com.svg'
import { useSelector, useDispatch } from 'react-redux';
import { Toaster, toast } from 'sonner'
import Cookies from "js-cookie";
import axios from "axios";
import { set_user_info } from "../state";
import { Tooltip } from "@mui/material";

export default function Navbar() {

  const base_url = import.meta.env.VITE_URL || 'http://localhost:8080';
  

  const [icon, setIcon] = useState(true);
  const asc = Cookies.get('accessToken')
  const [profilePic, setProfilePic] = useState(null);
  const [open, setOpen] = useState(false);
  const imageref = useRef();
  const menuref = useRef();
  const dispatch = useDispatch();

  const username = useSelector(state => state.user_info.username);

  const handleIcon = () => {
    setIcon(!icon);
  };

  const handleLinkClick = () => {
    if (!asc) {
      toast.error('Please login first');
    }
  }

  useEffect(() => {
    async function fetchprofile() {
      if (username) {
        try {
          const profilePix = await axios.get(`${base_url}/getprofilepic/${username}`);
          setProfilePic(profilePix.data);
        } catch (error) {
          console.error("Failed to fetch profile picture:", error);
        }
      }
    }
    fetchprofile();
  }, [username, base_url]);

  const handlewrite = () => {
    if (!asc) {
      toast.error('Please login first to write a blog');
    }
  }

  const handlelogout = async () => {
    try {
      // Get the test access token before clearing cookies
      const testaccessToken = Cookies.get('testaccessToken');
      const accessToken = Cookies.get('accessToken');
      
      if (!testaccessToken || !accessToken) {
        // If tokens aren't available, just clear everything locally
        handleLocalLogout(false); // Pass false to not show the local logout toast
        return;
      }
      
      // Call the logout API
      const res = await axios.delete(`${base_url}/api/logout`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-TestAccessToken': `Bearer ${testaccessToken}`
        }
      });
      
      if (res.status === 200) {
        // Success message will be shown from the local logout function
        handleLocalLogout(false, res.data.message || 'Logged out successfully');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      
      if (error.response && error.response.status === 401) {
        handleLocalLogout(false, 'Session already expired');
      } else {
        handleLocalLogout(false, 'Server logout failed, but you\'ve been logged out locally');
      }
    }
  };
  
  // Separate function to handle the local logout operations
  const handleLocalLogout = (showDefaultToast = true, customMessage = null) => {
    // Clear Redux state
    dispatch(set_user_info({ username: '', id: '', profile_pic: '' }));
    
    // Clear all auth cookies
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('testaccessToken');
    
    // Show toast for feedback - either the custom message or the default
    if (customMessage) {
      toast.success(customMessage, { duration: 2000 });
    } else if (showDefaultToast) {
      toast.success('Logging out...', { duration: 2000 });
    }
    
    // Redirect after a short delay to allow the toast to be seen
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  };

  const handleOutsideClick = (e) => {
    if (menuref.current && imageref.current) {
      if (!menuref.current.contains(e.target) && !imageref.current.contains(e.target)) {
        setOpen(false);
      }
    }
  };
  

  useEffect(() => {
    window.addEventListener('click', handleOutsideClick);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    }
  }, []);

  return (
    <div>
      <Toaster position="top-center" />
      <div className="nav-component">
        <div className="nav-items">
          <div className="icon">
            <Link to={asc ? '/writeblog' : ''} onClick={handlewrite}>
              <div className="writeicon">
                <FontAwesomeIcon icon={faPen} />
              </div>
            </Link>
            <Link to={asc ? '/writeblog' : ''} onClick={handlewrite}>
              <div className="icon_text">
                <p>Write</p>
              </div>
            </Link>
          </div>

          <div className="title mr-6">
            <Link to="/"><p>Mr. Blogs</p></Link>
            <img src={image} className="images" />
          </div>

          <div className="log">
            {!asc && (
              <Link to='/login' className="loginp">
                <p className="logx">Login?</p>
              </Link>
            )}
            <div className="profile-container">
              <Link>
                {asc && profilePic ? (
                  <img
                    ref={imageref}
                    src={profilePic}
                    alt="profilepic"
                    className="roundedProfilePic mr-5"
                    onClick={() => setOpen(!open)}
                  />
                ) : (
                  <Link to='/login'><FontAwesomeIcon icon={faUser} className="mr-4" /></Link>
                )}
              </Link>
            </div>
          </div>
        </div>
        {open && (
          <div className="profile-options" ref={menuref} style={{ zIndex: 9999 }}>
            <ul onClick={handleOutsideClick}>
              <Link to="/profile" onClick={() => setOpen(!open)}><li>Profile</li></Link>
              <Link to="/editprofile" onClick={() => setOpen(!open)}><li>Edit Profile</li></Link>
              <Link to={asc ? '/writeblog' : ''} onClick={handlewrite}><li>Write Blog</li></Link>
              <Link to="/blogdashboard" onClick={() => setOpen(!open)}><li>Dashboard</li></Link>
              {/* write blogs with protected route */}
              <Link onClick={handlelogout}><li>Logout</li></Link>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
