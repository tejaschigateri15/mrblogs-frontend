import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faUser, faPen } from '@fortawesome/free-solid-svg-icons';
// import { Tooltip } from 'react-tooltip'
import './css/module.css'
import Tooltip from '@mui/material/Tooltip';
import image from './batman-svgrepo-com.svg'
import Sidebar from "./Sidebar"
import { useSelector, useDispatch } from 'react-redux';
import { Toaster, toast } from 'sonner'
import Cookies from "js-cookie";
import axios from "axios";

export default function Nav() {
    const [icon, setIcon] = useState(true);
    const asc = Cookies.get('accessToken')
    const [profilePic, setProfilePic] = useState(null);

    const accessToken = useSelector(state => state.user_info.accessToken);
    const [cv, setcv] = useState(null)
    const handleIcon = () => {
        setIcon(!icon);
        console.log('hello');
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
                console.log(profilePic)
            }
        }
        fetchprofile()
    }, [username])

    const handlewrite = () => {
        if (!asc) {
            toast.error('Please login first to write a blog');
        }
    }


    return (
        <div>
            <Toaster position="top-center" />
            <div className="nav-component">
                <div className="nav-items">
                    <div className="icon">
                        <Link to={typeof asc !== 'undefined' ? '/writeblog' : ''} onClick={handlewrite}><div className="writeicon"><FontAwesomeIcon icon={faPen} /></div></Link>
                        <Link to={typeof asc !== 'undefined' ? '/writeblog' : ''} onClick={handlewrite}><div className="icon_text"><p>Write</p></div></Link>
                    </div>

                    <div className="title"><Link to="/"><p>Mr. Blogs</p></Link><img src={image} className="images" /></div>

                    <div className="log">

                        <div className={profilePic ? "fff" : "ddd"}>
                            <Tooltip title={asc ? username : ''} arrow>
                                <Link
                                    to='/profile'
                                // to={typeof asc !== 'undefined' ? '/profile' : ''} 
                                // onClick={handleLinkClick}
                                >
                                    {!profilePic ? <FontAwesomeIcon icon={faUser} /> : <img src={profilePic} alt="profilepic" className="roundedProfilePic" />}
                                </Link>
                            </Tooltip>
                        </div>


                        <Link to='/login' className="loginp"><p className="logx">Login?</p></Link>
                    </div>

                </div>

            </div>
            {/* {!icon ? <Sidebar /> : ''} */}

        </div>

    );
}
