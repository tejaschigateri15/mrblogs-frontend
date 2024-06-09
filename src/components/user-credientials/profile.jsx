import { Link, Outlet, useNavigate } from "react-router-dom";
import '../css/profile.css'
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faComment, faEdit, faList, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { TextField, Tooltip } from "@mui/material";
// import toast from 'react-hot-toast';
import { SocialIcon } from "react-social-icons";
import { Toaster, toast } from 'sonner'
import { set_user_info } from "../state";
import Cookies from "js-cookie";

export default function ProfileDashboard() {
  const user_info = useSelector(state => state.user_info);
  const { username } = user_info;
  const accessToken = useSelector(state => state.user_info.accessToken);
  // const [fetchedName, setFetchedName] = useState('');
  const [fetchedbio, setFetchedbio] = useState('');
  const [fetchedInsta, setFetchedInsta] = useState('');
  const [fetchedLinkedin, setFetchedLinkedin] = useState('');
  const [fetchedName, setFetchedName] = useState('');

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const asc = Cookies.get('accessToken')
  // console.log("sf", asc)

  const [image, setImage] = useState(null);



  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(image);

    try {
      const formData = new FormData();
      formData.append('image', image);

      const res = await axios.post('https://testingfinal.onrender.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // console.log("Response:", res.data);


    } catch (err) {
      console.error("Error:", err);
      // toast.error('Error during upload'); 
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!accessToken) {
        setFetchedbio(
          <span >
            Welcome! Please{" "}
            <Link to="/login" style={{ color: "#28a745" }}>
              login
            </Link>{" "}
            or{" "}
            <Link to="/signup" style={{ color: "#dc3545" }}>
              sign up
            </Link>{" "}
            to access your profile.
          </span>
        );
        // return;
      }
      try {
        const response = await axios.get(`https://testingfinal.onrender.com/api/getprofile/${username}`,
          {
            params: {
              username: username,
              accessToken: asc
            }
          }
        );
        // console.log("data  : ", response.data)
        if (response.status === 401) {
          toast.error('Please Login again');
          navigate('/login');
        }
        if (response.data) {
          // console.log("Response:", response.data);
          const { profile_pic, bio, instagram, linkedin, name } = response.data;
          setImage(profile_pic);
          setFetchedbio(bio);
          setFetchedInsta(instagram);
          setFetchedLinkedin(linkedin);
          setFetchedName(name);
          // console.log("fetchedName", fetchedName)
          dispatch(set_user_info({ username, id: '1', profile_pic }));
        }
        else {
          setFetchedbio(
            <span>
              Your profile is incomplete. Please go to the{" "}
              <Link to="/editprofile" style={{ color: "#28a745" }} className="ml-1">
                /editprofile
              </Link>{" "}
              page to edit your profile and add your bio, Instagram, LinkedIn, and profile image.
            </span>
          );
        }
      } catch (error) {
        // toast.error('Error during fetch, please try to login again');
        console.error(error);
        console.log("url", window.location.href)
      }
    };
    fetchProfile();
  }, []);



  const handlelogout = () => {
    // let y=false
    dispatch(set_user_info({ username: '', id: '', profile_pic: '' }))

    Cookies.remove('accessToken');

    Cookies.remove('refreshToken');

    setTimeout(() => { toast.success('Logged out successfully 👍') }, 3000)

    navigate('/login')
  }


  return (
    // name , pic , bio , insta , linkedin
    <div className="profile-main">
      {/* <div className="pagelinks"></div> */}
      <Toaster position="top-center" />
      <div className="rightoption">
        <div className="profilesettings">
          <div className="profilesettingname"><h2>Profile Settings</h2></div>
          <div className="profilelinks">
            <Link to="/editprofile"><p>EDIT PROFILE <FontAwesomeIcon icon={faEdit} /></p></Link>
            <button onClick={handlelogout}><a href=""><p>LOGOUT <FontAwesomeIcon icon={faSignOut} /></p></a></button>
          </div>
        </div>
      </div>
      <div className="profilecard shadow-md">
        <div className="profileitems">
          <div className={image ? "profilepic" : ""} id="xcv">
            <img src={image || "Default_pfp.svg.webp"} alt="" width="150px" height="170px" />
            <div>
              <div className="upload">
                <form action="" encType="multipart/form-data" onSubmit={handleSubmit}>
                  <div className="wrap">
                    <TextField
                      name="upload-photo"
                      type="file"
                      className=""
                      id="upload-photo"
                    // onChange={handleImage}
                    />
                    {/* <p className="ff"><button type="submit">Upload Image</button></p> */}
                  </div>
                </form>
              </div>


            </div>

          </div>
          <div className="profileinfo">
            <div className="profilename">
              <div className="profile-name"><h2>{username || "Guest User"}</h2>
                {/* <span>{id}</span> */}
              </div>
              <div className="edit-icon"><Tooltip title="Write Blogs" arrow><button disabled><Link to="/writeblog"><FontAwesomeIcon icon={faEdit} /></Link></button></Tooltip></div>
            </div>
            <div className="profilebio"> <p>{fetchedbio || <span>
              Your profile is incomplete. Please go to the{" "}
              <Link to="/editprofile" style={{ color: "#28a745" }} className="ml-1">
                /editprofile
              </Link>{" "}
              page to edit your profile and add your bio, Instagram, LinkedIn, and profile image.
            </span>}</p></div>
            <div className="blogscount flex justify-between items-center">
              <div className="socialmedlinks flex gap-3">
                <div className="insta">
                  <SocialIcon network="instagram" url={fetchedInsta.length > 0 ? fetchedInsta : ""} fgColor="#E1306C" bgColor="white" style={{ ':hover': { fgColor: "pink" } }} />
                </div>
                <div className="linkedin">
                  <SocialIcon network="linkedin" url={fetchedLinkedin.length > 0 ? fetchedLinkedin : ""} fgColor="#0077B5" bgColor="white" />
                </div>
              </div>
              <div className="blogdashboard  mr-1 bg-slate-200 px-4 py-2 rounded-lg">
                <Link className="flex gap-3" to="/blogdashboard"><p>Blog Dashboard</p><img src="/dashboard_1828765.png" alt="" width="20px" height="10px" /></Link>
              </div>
            </div>
            {/* <p>5 Blogs {username || "hello"} </p> */}
          </div>
        </div>
      </div>
      {/* <div className="underline"></div> */}
      <div className="mantain">
        <div className="main_allblog">
          <div className="conty">
            <button ><Link to='/profile/'> <p>All Blogs <FontAwesomeIcon icon={faList} /></p> </Link></button>
            <button><Link to='/profile/comments'> <p>Comments <FontAwesomeIcon icon={faComment} /></p> </Link></button>
            <button ><Link to='/profile/savedblog'> <p>Saved Blogs <FontAwesomeIcon icon={faBookmark} /></p> </Link></button>
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
}
