import { Link } from 'react-router-dom';
import '../css/blogdashboard.css';
// import { Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxArchive, faEdit, faTrash, faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Toaster, toast } from 'sonner';
import MainblogLoader from '../user-credientials/MainblogLoader';

export default function BlogDashboard() {

  const [blogs, setBlogs] = useState([]);
  const [likedblog, setLikedblog] = useState({});
  const [commentedBlog, setCommentedBlog] = useState({});
  const username = useSelector(state => state.user_info.username);
  const [isLoading, setIsLoading] = useState(true);


  async function confirmdeletex(id) {
    try {
      const res = await axios.delete(`https://testingfinal.onrender.com/api/deleteblog/${id}`);
      if (res.status === 200) {
        toast.success('Blog Deleted Successfully', { duration: 2000 });
        setTimeout(() => { window.location.reload() }, 2000)
      }
      // console.log(res);
    } catch (error) {
      toast.error('Error Deleting Blog', { duration: 2000 });
      console.error(error);
    }
  }

  function timestamptodate(timestamp) {
    const date = new Date(timestamp);
    return date.toDateString();
  }

  const confirmdetelete = (id) => {
    confirmAlert({
      title: '⚠️ Are you sure you want to delete this blog?',
      message: 'This action cannot be undone. 🗑️',
      buttons: [
        {
          label: 'Yes',
          onClick: () => confirmdeletex(id)
        },
        {
          label: 'No',
          onClick: null
        }
      ]
    });
  }

  async function confirmPrivate(id) {
    try {
      const res = await axios.get(`https://testingfinal.onrender.com/api/togglePrivate/${id}`);
      if (res.data === true) {
        toast.success('Blog Made Private Successfully', { duration: 2000 });
        setTimeout(() => { window.location.reload() }, 2000)
      }
      else{
        toast.success('Blog Made Public Successfully', { duration: 2000 });
        setTimeout(() => { window.location.reload() }, 2000)
      }
      // console.log(res);
    } catch (error) {
      toast.error('Error Making Blog Private', { duration: 2000 });
      console.error(error);
    }
  }

  const confirmUpdate = (id,isPrivate) => {
    confirmAlert({
      title: !isPrivate ? '⚠️ Are you sure you want to make this blog private?' : '⚠️ Are you sure you want to make this blog public?' ,
      message: !isPrivate ?  `Private blogs are visible only to you and won't be accessible to the public 🌍` : 'Once public, it will be visible to everyone.' ,
      buttons: [
        {
          label: 'Yes',
          onClick: () => confirmPrivate(id)
        },
        {
          label: 'No',
          onClick: null
        }
      ]
    });
  }

  useEffect(() => {
    const getallblogs = async () => {
      try {
        const res = await axios.get(`https://testingfinal.onrender.com/api/userblog/${username}`);
        setBlogs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    getallblogs();
  }, [])

  useEffect(() => {

    const mostLikedBlog = blogs.reduce((mostLiked, blog) => {
      return blog.likes.likedby.length > mostLiked.likes.likedby.length ? blog : mostLiked;
    }, blogs[0]);

    if (mostLikedBlog) {
      setLikedblog(mostLikedBlog);
    } else {
      setLikedblog({
        author: "Default Author",
        title: "Default Title",
        date: "Default Date",
      });
    }

    const mostCommentedBlog = blogs.reduce((mostCommented, blog) => {
      return blog.comments.length > mostCommented.comments.length ? blog : mostCommented;
    }, blogs[0]);

    if (mostCommentedBlog) {
      setCommentedBlog(mostCommentedBlog);
    } else {
      setCommentedBlog({
        author: "Default Author",
        title: "Default Title",
        date: "Default Date",
      });
    }

    // console.log("Total Likes:", totalLikes);
    // console.log("Total Comments:", totalComments);
    // console.log("Total Blogs:", blogs.length);
    // console.log("Most Liked Blog:", mostLikedBlog);
    // console.log("Most Commented Blog:", mostCommentedBlog);
  }, [blogs]);

  return (
    <div>
      <Toaster position="top-center" />
      <div className="container-tag my-16 w-[1400px] flex">
        <div className="dashitems w-[1000px]">
          <div className="metrics ml-36 flex mr-20 justify-between  px-8 py-6 rounded-3xl">
            <div className="likes flex flex-col">
              <div className='flex gap-1 '>
                <h2 className='text-xl mx-2'>Likes</h2>
                <img src="/heart.png" alt="" width="26px" className='mt-1' />
              </div>
              <p className='text-6xl my-3 mx-4 text-zinc-600'>{blogs.reduce((total, blog) => total + blog.likes.likedby.length, 0) || 0}</p>
            </div>
            <div className="totalblogs flex flex-col">
              <div className='flex gap-2'>
                <h2 className='text-xl'>Total Blogs</h2>
                <img src="/blogging.png" alt="" width="26px" />
              </div>
              <p className='text-6xl mx-10 my-3 text-zinc-600'>{blogs.length || 0}</p>
            </div>
            <div className="totalcomments flex flex-col">
              <div className='flex gap-2 items-center'>
                <h2 className='text-xl'>Comments</h2>
                <img src="/comments.png" alt="" width="26px" className='mt-2' />
              </div>
              <p className='text-6xl mx-7 my-3 text-zinc-600'>{blogs.reduce((total, blog) => total + blog.comments.length, 0) || 0}</p>
            </div>
          </div>
          <div className="manage-blogs">
            <div className="blogs-header ml-36 mr-20 mt-16">
              <span className="line"></span>
              <span className='VCB'>Manage Blogs</span>
              <span className="line"></span>
            </div>
            { isLoading ? <div className="loadderr ml-36 mr-16 mt-6"><MainblogLoader/></div> : blogs.length > 0 ? blogs.map((blog) => (
              <div className="blogs ml-36 mr-16" key={blog._id} >
                <div className="blogbodyyy">
                  <div className="authinfo">
                    <div className="authimage">
                      <img src={blog.author_img || "pxfuel.jpg"} alt="Profile Image" />
                    </div>
                    <div className="authname">
                      <p>{blog.author || "Ravi Sharma"}</p>
                    </div>
                    <div className="blogdate">
                      <p>{blog.date.slice(0, 10) || "Jan 01"}</p>
                    </div>
                    { blog.isPrivate ? 
                    <div className="isArchived ml-3  text-gray-400 px-2  border-2 rounded-2xl  text-sm items-center">
                      <p> Private </p>
                    </div> : null
                    }
                  </div>
                  <div className="bodyblog">
                    <div className="blog-title">
                      <Link to={`/blog/${blog._id}`}><p>{blog.title || "Top 30 JavaScript Interview Questions and Answers for 2024"}</p></Link>
                    </div>
                    <div className="blog-body" dangerouslySetInnerHTML={{ __html: blog.body }}></div>
                  </div>
                  <div className="blog-info">
                  </div>
                </div>
                <div className="blogimage">
                  <img src={blog.blog_image || "pxfuel.jpg"} alt="" />
                </div>
                <div className="blogmanageoptions">
                  <div className="nav__item cursor-pointer flex item-center ">
                    <Link to={`/editblog/${blog._id}`}><FontAwesomeIcon icon={faEdit} className='nav__item-icon' /></Link>
                    <span className="nav__item-text">Edit</span>
                  </div>
                  <div className="nav__item  cursor-pointer">
                    <FontAwesomeIcon icon={faTrash} className='nav__item-icon' onClick={() => confirmdetelete(blog._id)} />
                    <span className="nav__item-text">Delete</span>
                  </div>
                  <div className="nav__item cursor-pointer">
                    <FontAwesomeIcon icon={faUserSecret} className='nav__item-icon' onClick={()=> confirmUpdate(blog._id,blog.isPrivate)} />
                    <span className="nav__item-text">Private</span>
                  </div>
                </div>
              </div>
            )) : <div className="no-blog mx-52 w-[400px] text-lg ">Looks like there are no blogs created by the user yet. Start writing and share your thoughts with the world!</div>
            }
          </div>
        </div>
        { blogs.length > 0 &&
        <div className="right-dash mx-8 w-[350px]">
          <div className="right-dash-items">
            <div className="mostlikedblog">
              <h2>Most Liked</h2>
              <div className="top-picksimg mb-12 mt-5">
                <div className="top-headdx flex items-end gap-3">
                  <img src={likedblog.author_img || "pxfuel.jpg"} alt="" />
                  <h3>{likedblog.author || "Default Author"}</h3>
                </div>
                <div className="topick-title">
                  <Link to={`/blog/${likedblog._id}`}><p>{likedblog.title || "Default Title"}</p></Link>
                </div>
                <div className="blog-foot flex gap-6">
                  <p className='save-min-readx'>{timestamptodate(likedblog.date) || "Default Date"}</p>
                  {/* //blog.date.slice(0, 10) */}
                  <p className='save-min-read'>{likedblog.readingTime || "3"} min read</p>
                </div>
              </div>
            </div>
            <div className="mostcommentedblog">
              <h2>Most Commented</h2>
              <div className="top-picksimg mb-12 mt-5">
                <div className="top-headdx flex items-end gap-3">
                  <img src={commentedBlog.author_img || "pxfuel.jpg"} alt="" />
                  <h3>{commentedBlog.author || "Default Author"}</h3>
                </div>
                <div className="topick-title">
                  <Link to={`/blog/${commentedBlog._id}`}><p>{commentedBlog.title || "Default Title"}</p></Link>
                </div>
                <div className="blog-foot flex gap-6">
                  <p className='save-min-readx'>{timestamptodate(commentedBlog.date) || "Default Date"}</p>
                  <p className='save-min-read'>{commentedBlog.readingTime || "3"} min read</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  );
}
