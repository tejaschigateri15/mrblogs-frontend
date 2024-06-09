import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CircularProgress, Tooltip } from '@mui/material'
import { Link } from 'react-router-dom'
import { Toaster } from 'sonner'
import calculatereadtime from '../Utils/Calreadtime'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import axios from 'axios' 

export default function SavedBlogPage() {

    const username = useSelector(state => state.user_info.username);

    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const getSavedBlogs = async () => {
            try {
                const res = await axios.get(`https://testingfinal.onrender.com/api/savedblog/${username}`);
                setBlogs(res.data);
               
            } catch (err) {
                console.error(err);
            }
        }
        getSavedBlogs();
    }, [username]);



  return (
    <div>
        <div>
         <Toaster  position="top-center" />
        <div className="conatainer-tag  mx-auto my-10 w-[1200px]">
            {/* categories */}
            <div className="topic-header flex flex-col justify-center items-center gap-6 mb-8">
                <h2 className=' topicheadx font-bold'>Saved Blogs <FontAwesomeIcon icon={faBookmark} style={{fontSize:"26px",color:"#7856FF",marginLeft:"15px"}}/></h2>
                <div className="topic-head-footer flex gap-6">
                    {/* <p>Topic</p>
                    <p>{totalfollowers} Followers</p>
                    <p>{totalblogs} Blogs</p> */}
                </div>
                {/* <button className='follow'>Follow</button> */}
            </div>
            <div className="recommendedtopics mt-20">
                {/* <h2 className='text-2xl rch'>Recommended Blogs</h2> */}
                <div className="grid grid-cols-3 gap-4 mt-8 mb-6 " >
                   { blogs ? blogs.map((blog) => (
                     <div className=" w-[360px] flex flex-col gap-3 mb-8 xxx" key={blog._id}>
                        
                            <img src={ blog.blog_image || "../../../public/pxfuel.jpg"} alt="gr" className='h-[200px] w-full object-cover rounded-3xl' />
                        <div className="top-headd flex items-end gap-3 mt-3">
                            <img src={blog.author_img || "../../../public/pxfuel.jpg"} alt="" className='w-[30px] h-[30px] object-cover rounded-3xl' />
                            <h3>{blog.author||"Kushal Anburmatt"}</h3>
                        </div>
                        <div className="topic-blog-title mt-1 ">
                            <Link  to={`/blog/${blog._id}`} ><p className='font-bold mb-2 topic-title'>{blog.title || "Top 30 JavaScript Interview Questions and Answers for 2024"}</p></Link>
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
                        
                        

                    </div>)) :<CircularProgress style={{ color: '#7856FF' }} /> }

                </div>


            </div>

        </div>
        </div>
    </div>
  )
}
