// import React from 'react'
import { useEffect, useState } from 'react';
import '../css/Profileblogs.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark} from '@fortawesome/free-solid-svg-icons';
import { Toaster, toast } from 'sonner';
import { Link } from 'react-router-dom';
import calculatereadtime from '../Utils/Calreadtime';
import Loader from '../user-credientials/Loader'

export default function Profileblogs() {

    const base_url = import.meta.env.VITE_URL || 'http://localhost:8080';


    const user_info = useSelector(state => state.user_info);
    const { username } = user_info;
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getblogs = async () => {
            try {
                const res = await axios.get(`${base_url}/api/userblog/${username}`);
                // console.log(username)
                // console.log("user blogs : ", res.data);
                setBlogs(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        getblogs();
    }, [username]);

    return (
        <div className="mantain">
            <div className="main_allblog">
                <div className="blogscontentz">
                    {isLoading ? (
                        <Loader /> 
                    ) : (
                        blogs.length > 0 ?  blogs.map((blog) => (
                            <div className="blogsz shadow-md" key={blog._id}>
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
                                            <Link to={`/blog/${blog._id}`}><p>{blog.title || "Top 30 JavaScript Interview Questions and Answers for 2024"}</p></Link>
                                        </div>
                                        <div className="blog-body" dangerouslySetInnerHTML={{ __html: blog.body }}></div>
                                    </div>
                                    <div className="blog-info">
                                        <div className="meta">
                                            <div className="blog-tags">
                                                <p>{blog.tags || "javascript"}</p>
                                            </div>
                                            <div className="blogmin">
                                                <p>{calculatereadtime(blog.body)}min read</p>
                                            </div>
                                        </div>
                                        <Toaster position="top-center" />
                                        <div className="saveicon">
                                            <button onClick={() => toast('Blog is Saved 👍')}>
                                                <FontAwesomeIcon icon={faBookmark} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="blogimage">
                                    <img src={blog.blog_image || "pxfuel.jpg"} alt="" />
                                </div>
                            </div>
                        )) :  <div className="no-blog mx-52 w-[400px] text-lg ">Looks like there are no blogs created by the user yet. Start writing and share your thoughts with the world!</div>
                    )}
                </div>
            </div>
        </div>
    )
}