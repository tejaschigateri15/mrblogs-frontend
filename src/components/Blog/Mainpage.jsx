import { Link, Outlet } from 'react-router-dom';
import '../css/mainpage.css';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Toaster, toast } from 'sonner'
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Tooltip } from '@mui/material';
import calculatereadtime from '../Utils/Calreadtime';
import Cookies from 'js-cookie';
import MainblogLoader from '../user-credientials/MainblogLoader';
import { useDispatch } from 'react-redux';
import { set_user_info } from '../state';
import { List, Cpu, Briefcase, Stethoscope, MoreHorizontal, Lightbulb } from 'lucide-react';


// import process from 'process';

// dotenv.config();

export default function Mainpage() {
    const containerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const username = useSelector(state => state.user_info.username);
    const [blogs, setBlogs] = useState([]);
    const [activeButton, setActiveButton] = useState(false);
    const [recentlysaved, setRecentlySaved] = useState([]);
    const [issavedblog, setIsSavedBlog] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const asc = Cookies.get('accessToken')

    const [scrollPosition, setScrollPosition] = useState(0);
    const [scrollLength, setScrollLength] = useState(0);
    const [savedblogId, setSavedBlogId] = useState([]);
    const [profilepic, setProfilePic] = useState(null);

    const dispatch = useDispatch();

    const base_url = import.meta.env.VITE_URL || 'http://localhost:8080';

    const topics = ['Economics', 'Stocks', 'Artificial Intelligence', 'Technology', 'Architecture', 'Finance', 'Travel', 'Programming', 'Lifestyle', 'Science'];

    useEffect(() => {
        const fetchBlogs = async () => {
            try {

                // console.log("dfg",import.meta.env.VITE_URL);

                const allBlogsResponse = await axios.get(`${base_url}/api/getblog`);
                // console.log("all blogs ", allBlogsResponse.data);
                setBlogs(allBlogsResponse.data);
                if (allBlogsResponse.data.length > 0) {
                    setIsLoading(false);
                }

                if (username) {

                    const recentlySavedResponse = await axios.get(`${base_url}/api/recentlysaved/${username}`);
                    if (recentlySavedResponse.data.message === "No saved blogs") {
                        // console.log("No saved blogs found");
                    } else {
                        // console.log("Recently saved blogs: ", recentlySavedResponse.data);
                        setRecentlySaved(recentlySavedResponse.data.recently_savedblog);
                        const { blog_id, profile_pic } = recentlySavedResponse.data;

                        setSavedBlogId(recentlySavedResponse.data.blog_id);

                        setProfilePic(recentlySavedResponse.data.profile_pic);

                        setIsSavedBlog(true);
                    }
                } else {
                    console.log("No user logged in");
                }
            } catch (err) {
                console.error(err);
            }

        };

        fetchBlogs();

    }, [username]);

    useEffect(() => {
        const checkMobile = () => {
          setIsMobile(window.innerWidth <= 480);
        };
    
        checkMobile();
        window.addEventListener('resize', checkMobile);
    
        return () => window.removeEventListener('resize', checkMobile);
      }, []);
    
      useEffect(() => {
        if (!isMobile) return;
    
        const container = containerRef.current;
        let scrollTimer = null;
    
        const handleScroll = () => {
          setIsScrolling(true);
          clearTimeout(scrollTimer);
          scrollTimer = setTimeout(() => {
            setIsScrolling(false);
            updateArrows();
          }, 150);
        };
    
        const updateArrows = () => {
          if (container) {
            setShowLeftArrow(container.scrollLeft > 0);
            setShowRightArrow(
              container.scrollLeft < container.scrollWidth - container.clientWidth - 1
            );
          }
        };
    
        if (container) {
          container.addEventListener('scroll', handleScroll);
          updateArrows();
        }
    
        return () => {
          if (container) {
            container.removeEventListener('scroll', handleScroll);
          }
          clearTimeout(scrollTimer);
        };
      }, [isMobile]);


    const handlesave = async (id) => {
        try {
            const res = await axios.post(`${base_url}/api/saveblog`, {
                username: username,
                blog_id: id
            });
            // console.log(res.data);
            if (res.data) {
                setSavedBlogId([...savedblogId, id]);
                toast.success('Blog saved successfully');

            }

        } catch (err) {
            console.error(err);
        }
    }




    const handlecategory = async (category) => {
        try {
            const res = await axios.get(`${base_url}/api/category/${category}`);
            // console.log(res.data);
            setBlogs(res.data);
            setActiveButton(true)
        } catch (err) {
            console.error(err);
        }
    }

    const fetchallblogs = async () => {
        try {
            const res = await axios.get(`${base_url}/api/getblog`);
            // console.log(res.data);
            setBlogs(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    const handlewrite = () => {
        if (!asc) {
            toast.error('Please login first to write a blog');
        }
    }

    const bookmarkIconStyle = {
        // border: '1px solid black', // Black border
        // borderRadius: '50%', // Make the border rounded
        // padding: '5px', // Adjust padding as needed
        backgroundColor: 'white', // White interior
    };

    return (
        <div>
            <div className="containers pb-16">
                <Toaster position="top-center" />
                <div className="maincontent mb-12">
                    <div className="contxx">
                        <div className="cont" ref={containerRef}>
                            <button onClick={fetchallblogs}>
                                <Link to='#'>
                                    <p className='nav_p ml-4'>AllBlogs <List size={22} className='svgi ml-1' /></p>
                                </Link>
                            </button>
                            <button className={activeButton ? 'btn' : ''} onClick={() => handlecategory("Technology")}>
                                <Link to='#'>
                                    <p className='nav_p'>Technology <Cpu size={22} className='ml-1' /></p>
                                </Link>
                            </button>
                            <button className='btn' onClick={() => handlecategory("Business")}>
                                <Link to='#'>
                                    <p className='nav_p'>Business <Briefcase size={22} className='ml-1' /></p>
                                </Link>
                            </button>
                            <button className='btn' onClick={() => handlecategory("Science")}>
                                <Link to='#'>
                                    <p className='nav_p'>Science <Lightbulb size={22} className='ml-1' /></p>
                                </Link>
                            </button>
                            <button className='btn' onClick={() => handlecategory("Health")}>
                                <Link to='#'>
                                    <p className='nav_p'>Health <Stethoscope size={22} className='ml-1' /></p>
                                </Link>
                            </button>
                            <button className='btn' onClick={() => handlecategory("Others")}>
                                <Link to='#'>
                                    <p className='nav_p'>Others <MoreHorizontal size={22} className='ml-1' /></p>
                                </Link>
                            </button>
                        </div>
                        <div className="blogscontent pb-20">
                            {isLoading ? (
                                <MainblogLoader />
                            ) : (
                                blogs.map((blog) => (
                                    !blog.isPrivate && (
                                        <div className="blogs" key={blog._id}>
                                            <div className="blogbodyyy">
                                                <div className="authinfo">
                                                    <div className="authimage">
                                                        <img src={blog.author_img || "pxfuel.jpg"} alt="" />
                                                    </div>
                                                    <div className="authname">
                                                        <p>{blog.author || "Ravi Sharma"}</p>
                                                    </div>
                                                    <div className="blogdate">
                                                        <p>{blog.date.slice(0, 10) || "Jan 01"}</p>
                                                    </div>
                                                </div>
                                                <div className="bodyblog">
                                                    <div className="blog-title">
                                                        <Link to={`/blog/${blog._id}`}>
                                                            <p>{blog.title || "Top 30 JavaScript Interview Questions and Answers for 2024"}</p>
                                                        </Link>
                                                    </div>
                                                    <div className="blog-body" dangerouslySetInnerHTML={{ __html: blog.body }}></div>
                                                </div>
                                                <div className="blog-info">
                                                    <div className="meta">
                                                        <div className="blog-tags">
                                                            <p>{blog.tags || "javascript"}</p>
                                                        </div>
                                                        <div className="blogmin">
                                                            <p>{calculatereadtime(blog.body)} min read</p>
                                                        </div>
                                                    </div>
                                                    <div className="saveicon">
                                                        <button onClick={() => handlesave(blog._id)}>
                                                            <Tooltip title="Save Blog" arrow>
                                                                <FontAwesomeIcon
                                                                    icon={faBookmark}
                                                                    style={{
                                                                        color: !savedblogId.includes(blog._id) ? 'rgb(220, 216, 216)' : 'black',
                                                                        // fontSize: '20px',
                                                                        cursor: 'pointer',
                                                                        backgroundColor: 'white',
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="blogimage">
                                                <img src={blog.blog_image || "pxfuel.jpg"} alt="" />
                                            </div>
                                        </div>
                                    )
                                ))
                            )}
                        </div>
                    </div>
                </div>
                <div className="subcontent">
                    {/* <BlogOptions /> */}
                    <div className="right-contents ml-5" id='right'>
                        <div className="right-items">
                            {/* <div className="top-picks">
                            <h2 className='mb-6 text-lg'>Top Blogs</h2>
                        {popularblogs && popularblogs.map((blog) => (
                            <div className="top-picksimg mb-5" key={blog._id}>
                                <div className="top-headd flex items-end gap-3" >
                                    <img src={blog.author_img || "pxfuel.jpg"} alt=""  />
                                    <h3>{blog.author || "Kushal Anburmattxx"}</h3>
                                </div>
                                <div className="topick-title">
                                   <Link to={`/blog/${blog._id}`}><p>{ blog.title || "Top 30 JavaScript Interview Questions and Answers for 2024"}</p></Link> 
                                </div>
                            </div>
                        ))}  
                       
                            <div className="topics-link"><Link><p className='text-slate-500'>See the full list </p></Link></div> */}
                            {/* </div> */}
                            <div className="startwriting mt-5 px-10 py-4 bg-gray-200 w-[240px] h-[200px] rounded-xl">
                                <div className="start-items">
                                    <h2 className='font-bold mb-4'>Writing on Mr. Blogs</h2>
                                    <p>Unleash Your Voice</p>
                                    <p>Share Your Passion</p>
                                    <p>Start Writing Today!</p>
                                    <Link to={typeof asc !== 'undefined' ? '/writeblog' : ''} onClick={handlewrite}><button className='bg-slate-800 text-white px-4 py-2 mt-4 rounded-2xl  write-start'><p className='sttta'>Start Writing</p></button></Link>
                                </div>
                            </div>
                            <div className="recommended-topics mt-10">
                                <h2 className='font-bold'>Recommended Topics</h2>
                                <div className="topics-rec flex flex-wrap gap-4 p-4 mr-20">
                                    {topics.map((topic) => (
                                        <Link to={`/topic/${topic}`} key={topic}><div className="topic-item">{topic}</div></Link>
                                    ))}
                                </div>
                                {/* <div className="topics-link  mt-2"><Link><p className='text-slate-500'>See more topics </p></Link></div> */}
                            </div>
                            <div className="recently-saved mt-7">
                                <h2 className='font-bold mb-4'>Recently Saved</h2>
                                {username ? issavedblog ? recentlysaved.map((saved) => (
                                    <div className="top-picksimg mb-5" key={saved._id}>
                                        <div className="top-headd flex items-center gap-3">
                                            <img src={saved.author_img || "pxfuel.jpg"} alt="" />
                                            <h3>{saved.author || "Kushal Anburmatt"}</h3>
                                        </div>
                                        <div className="topick-title ">
                                            <Link to={`/blog/${saved._id}`}><p>{saved.title || "Top 30 JavaScript Interview Questions and Answers for 2024"}</p></Link>
                                        </div>
                                        <div className="blog-foot flex gap-6">
                                            <p className='save-min-readx'>{saved.date.slice(0, 10) || "Aug,19 2023"}</p>
                                            <p className='save-min-read'>{"3" || calculatereadtime(saved.body)} min read</p>
                                        </div>

                                    </div>
                                )) : <p className='nbv w-[270px]'>Zero saved blogs? Let’s change that! Dive into our collection and save <FontAwesomeIcon icon={faBookmark} style={{ marginLeft: "2px" }} /> your favorites.</p> : <p className='nbv w-[270px]'>Welcome! 😊 Haven't signed up yet? 🚀 Explore our blogs 📚 and save favorites ❤️ to start your journey! Click to join now! 🌟</p>}
                                <div className="topics-link mt-5 ">
                                    {issavedblog ? <Link to='/all/savedblogs'><p className='text-slate-500'>See all {">>"}</p></Link> : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
