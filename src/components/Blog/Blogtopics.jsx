import { useEffect, useState } from 'react'
import '../css/blogoptions.css'
import '../css/mainpage.css';
import { CircularProgress, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import calculatereadtime from '../Utils/Calreadtime';
import { useSelector } from 'react-redux';
import { Toaster, toast } from 'sonner';
import TopicLoader from '../user-credientials/TopicLoader';
import Cookies from 'js-cookie';

export default function Blogtopics() {

    const base_url = import.meta.env.VITE_URL || 'http://localhost:8080';

    const [blogs, setBlogs] = useState([]);
    const [totalfollowers, setTotalFollowers] = useState(0);
    const [activeButton, setActiveButton] = useState(false);
    const [category, setCategory] = useState('');
    const [totalblogs, setTotalBlogs] = useState(0);
    const [blogbody, setBlogbody] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [isloading, setIsloading] = useState(true);
    const params = useParams();
    const username = useSelector(state => state.user_info.username);
    const [isFollowed, setIsFollowed] = useState(false);

    const testaccessToken = Cookies.get('testaccessToken')


    useEffect(() => {
        const handlecategory = async (category) => {
            try {
                const res = await axios.get(`${base_url}/api/category/${category}`);
                // console.log(res.data);
                const getcategoryinfo = await axios.get(`${base_url}/api/getcategoryinfo/${category}`);
                // const res = await axios.get(`http://localhost:8080/api/category/${category}`);
                // const getcategoryinfo = await axios.get(`http://localhost:8080/api/getcategoryinfo/${category}`);

                // console.log(getcategoryinfo.data);
                if (getcategoryinfo.data) {
                    const { followed_by } = getcategoryinfo.data;

                    setTotalFollowers(followed_by.length);
                    if (followed_by.includes(username)) {
                        // setActiveButton(false);
                        setIsFollowed(true);
                    }
                }
                if (res.data.length > 0){

                    setBlogs(res.data);
                    setIsloading(false);
                }
                setCategory(category);
                // setBlogbody(res.data.body);
                setActiveButton(true);
                setTotalBlogs(res.data.length);
            } catch (err) {
                console.error(err);
            }
        };
        handlecategory(params.tag);
    }, []);


    const handleFollow = async (category) => {
        const accessToken = Cookies.get('accessToken');
        
        if (!accessToken || !username) {
            toast.error('Please login to follow this category', { duration: 2000 });
            return;
        }
        
        try {
            const testaccessToken = Cookies.get('testaccessToken');
            if (!testaccessToken) {
                toast.error('Test access token is missing. Please login again.', { duration: 2000 });
                return;
            }
            
            const res = await axios.post(
                `${base_url}/api/followcategory`, 
                { category, username },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'X-TestAccessToken': `Bearer ${testaccessToken}`
                    },
                }
            );
    
            if (res.status === 200) {
                toast.success(res.data, { duration: 2000 });
                setIsFollowed(true);
                setTotalFollowers(prev => prev + 1);
                setRefresh(!refresh);
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 401) {
                toast.error('Your session has expired. Please login again.', { duration: 3000 });
            } else {
                toast.error('Failed to follow category. Please try again.', { duration: 2000 });
            }
        }
    }





    return (
        <div>
            <Toaster position="top-center" />
            <div className="conatainer-tag  mx-auto my-10 w-[1200px]">
                {/* categories */}
                <div className="topic-header flex flex-col justify-center items-center gap-6 mb-8">
                    <h2 className=' topichead font-bold'>{params.tag || <CircularProgress style={{ color: '#7856FF' }} />}</h2>
                    <div className="topic-head-footer flex gap-6">
                        <p>Topic</p>
                        <p>{totalfollowers || 0} Followers</p>
                        <p>{totalblogs} Blogs</p>
                    </div>
                    {/* <button className='follow' onClick={()=>handleFollow(category)}>Follow</button> */}
                    <button
                        className='follow'
                        onClick={() => handleFollow(category)}
                        disabled={isFollowed}
                        style={{ cursor: isFollowed ? 'not-allowed' : 'pointer' }}
                    >
                        {isFollowed ? "Followed" : "Following"}
                    </button>
                </div>
                <div className="recommendedtopics mt-20">
                    <h2 className='text-2xl rch'>Recommended Blogs</h2>
                    <div className="grid grid-cols-3 gap-4 mt-8 mb-6" >
                        {blogs && blogs.length > 0 ? blogs.map((blog) => (
                            !blog.isPrivate &&
                            <div className=" w-[360px] flex flex-col gap-3 mb-8 xxx" key={blog._id}>

                                <img src={blog.blog_image || "../../../public/pxfuel.jpg"} alt="gr" className='h-[200px] w-full object-cover rounded-3xl' />
                                <div className="top-headd flex items-end gap-3 mt-3">
                                    <img src={blog.author_img || "../../../public/pxfuel.jpg"} alt="" className='w-[30px] h-[30px] object-cover rounded-3xl' />
                                    <h3>{blog.author || "Kushal Anburmatt"}</h3>
                                </div>
                                <div className="topic-blog-title mt-1 ">
                                    <Link to={`/blog/${blog._id}`} ><p className='font-bold mb-2 topic-title'>{blog.title || "Top 30 JavaScript Interview Questions and Answers for 2024"}</p></Link>
                                    <div className="blog-body" dangerouslySetInnerHTML={{ __html: blog.body }}></div>
                                </div>
                                <div className="top-foot flex justify-between">
                                    <div className="blog-foot flex gap-6">
                                        <p className='save-min-readx'>Aug,19 2023</p>
                                        <p className='save-min-read'>{calculatereadtime(blog.body)} min read</p>
                                    </div>
                                    <div className="save-blog-con mr-10">
                                        <Tooltip title="Save Blog" arrow><FontAwesomeIcon icon={faBookmark} /></Tooltip>
                                    </div>
                                </div>



                            </div>))
                            :
                            <div className="flex  h-64">
                                <p className="text-xl text-gray-500">No blogs found on this topic...</p>
                            </div>


                        }
                    </div>



                </div>

            </div>
        </div>
    )
}
