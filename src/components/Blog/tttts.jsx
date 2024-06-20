import { useEffect, useRef, useState } from "react";
import { Link, unstable_HistoryRouter, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPen } from '@fortawesome/free-solid-svg-icons';
import '../css/module.css'
import '../css/testing.css'
import image from '/batman-svgrepo-com.svg'
// import Sidebar from "./Sidebar"
import { useSelector, useDispatch } from 'react-redux';
import { Toaster, toast } from 'sonner'
import Cookies from "js-cookie";
import axios from "axios";
import { set_user_info } from "../state";

export default function Navbar() {
  const [icon, setIcon] = useState(true);
  const asc = Cookies.get('accessToken')
  const [profilePic, setProfilePic] = useState(null);
  const [open, setOpen] = useState(false);
  const imageref = useRef()
  const menuref = useRef()
  const dispatch = useDispatch()
  

  const accessToken = useSelector(state => state.user_info.accessToken);
  const [cv, setcv] = useState(null)
  const handleIcon = () => {
    setIcon(!icon);
    // console.log('hello');
  };

  const username = useSelector(state => state.user_info.username)

  const handleLinkClick = () => {
    // console.log("ascxx : ",asc)
    if (!asc) {
      toast.error('Please login first');
    }
  }

  useEffect(() => {

    async function fetchprofile() {
      if (username.length > 0) {
        const profilePix = await axios.get(`https://testingfinal.onrender.com/getprofilepic/${username}`)
        setProfilePic(profilePix.data)
        // console.log(profilePic)
      }
    }
    fetchprofile()
    // console.log("fs ",asc)
  }, [username])

  const handlewrite = () => {
    if (!asc) {
      toast.error('Please login first to write a blog');
    }
  }

  function handlemenuclick(e) {
    console.log(e.target === imageref.current)
  }

  const handlelogout = () => {
    // let y=false
    dispatch(set_user_info({ username: '', id: '', profile_pic: '' }))

    Cookies.remove('accessToken');

    Cookies.remove('refreshToken');

    setTimeout(() => { toast.success('Logged out successfully 👍') }, 3000)
    window.location.href = '/login';

  }

  const handleOutsideClick = (e) => {
    if (!menuref.current.contains(e.target) && !imageref.current.contains(e.target)) {
      setOpen(false);
    }
  }

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
            <Link to={asc  ? '/writeblog' : ''} onClick={handlewrite}><div className="writeicon"><FontAwesomeIcon icon={faPen} /></div></Link>
            <Link to={asc  ? '/writeblog' : ''} onClick={handlewrite}><div className="icon_text"><p>Write</p></div></Link>
          </div>

          <div className="title"><Link to="/"><p>Mr. Blogs</p></Link><img src={image} className="images" /></div>

          <div className="log">

            <div className={profilePic ? "fff" : "ddd"}>
         
              <Link
                // to='/profile'
              >
                {!profilePic && typeof asc == 'undefined' ? <FontAwesomeIcon icon={faUser} /> : asc ? <img ref={imageref} src={profilePic} alt="profilepic" className="roundedProfilePic mr-5" onClick={()=>{setOpen(!open)}} /> : <FontAwesomeIcon icon={faUser} />}
                {/* {profilePic &&  asc  ? <img ref={imageref} src={profilePic} alt="profilepic" className="roundedProfilePic" onClick={()=>{setOpen(!open)}} /> : <FontAwesomeIcon icon={faUser} />  } */}
              </Link>
          
            </div>


           { !asc ?  <Link to='/login' className="loginp"><p className="logx">Login?</p></Link> : ''}
          </div>

        </div>
       { open && <div className="profile-options" ref={menuref} style={{ zIndex: 9999 }}>
          <ul onClick={(e)=>{handlemenuclick(e)}}>
            <Link to="/profile" onClick={()=>{setOpen(!open)}} ><li>Profile</li></Link>
            <Link to="/editprofile" onClick={()=>{setOpen(!open)}} ><li>Edit Profile</li></Link>
            <Link to="/blogdashboard" onClick={()=>{setOpen(!open)}} ><li>Dashboard</li></Link>
            <Link onClick={handlelogout}><li>Logout</li></Link>

          </ul>
        </div>}

      </div>
      {/* {!icon ? <Sidebar /> : ''} */}

    </div>

  );
}
