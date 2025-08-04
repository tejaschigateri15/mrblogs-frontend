import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/blogdashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxArchive, faEdit, faEye, faTrash, faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import MainblogLoader from '../user-credientials/MainblogLoader';
import PrivateToggleDialog from './PrivateToggleDialog';
import DeleteConfirmationDialog from './Deletedialog';
import EditConfirmationDialog from './EditConfirmationDialog';
import Cookies from 'js-cookie';

export default function BlogDashboard() {
  const base_url = import.meta.env.VITE_URL || 'http://localhost:8080';
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [likedblog, setLikedblog] = useState({});
  const [commentedBlog, setCommentedBlog] = useState({});
  const username = useSelector(state => state.user_info.username);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPrivateDialogOpen, setIsPrivateDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [blogToEdit, setBlogToEdit] = useState(null);

  const testaccessToken = Cookies.get('testaccessToken')

  async function confirmdeletex() {
    if (!testaccessToken) {
      toast.error('Please login to delete the blog', { duration: 2000 });
      return;
    }
    try {
      const res = await axios.delete(`${base_url}/api/deleteblog/${blogToDelete}`, {
        headers: {
          'X-TestAccessToken': `Bearer ${testaccessToken}`
        }
      });
      if (res.status === 200) {
        toast.success('Blog Deleted Successfully', { duration: 2000 });
        setBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== blogToDelete));
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        toast.error('Session expired. Please login again to continue.', {
          duration: 3000,
          dismissible: true,
          action: {
            label: 'Login',
            onClick: () => window.location.href = '/login' // Redirect to login page
          },
          onAutoClose: () => console.log('Toast closed automatically after timeout')
        });
      } else {
        toast.error('Error Deleting Blog', { duration: 2000 });
      }
    } finally {
      setIsDeleteDialogOpen(false);
      setBlogToDelete(null);
    }
  }

  function timestamptodate(timestamp) {
    const date = new Date(timestamp);
    return date.toDateString();
  }

  const openDeleteDialog = (id) => {
    setBlogToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const openEditDialog = (blog) => {
    setBlogToEdit(blog);
    setIsEditDialogOpen(true);
  };

  const handleConfirmEdit = () => {
    if (blogToEdit) {
      navigate(`/editblog/${blogToEdit._id}`);
    }
    setIsEditDialogOpen(false);
  };

  const handleConfirmPrivate = async () => {
    if (!selectedBlog) return;
  
    if (!testaccessToken) {
      toast.error('Please login to update blog privacy', { duration: 2000 });
      return;
    }
  
    try {
      const res = await axios.get(`${base_url}/api/togglePrivate/${selectedBlog.id}`, {
        headers: {
          'X-TestAccessToken': `Bearer ${testaccessToken}`
        }
      });
      const newPrivateStatus = res.data;
      
      setBlogs(prevBlogs => prevBlogs.map(blog => 
        blog._id === selectedBlog.id ? { ...blog, isPrivate: newPrivateStatus } : blog
      ));
  
      toast.success(`Blog Made ${newPrivateStatus ? 'Private' : 'Public'} Successfully`, { duration: 2000 });
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        toast.error('Session expired. Please login again to continue.', {
          duration: 3000,
          dismissible: true,
          action: {
            label: 'Login',
            onClick: () => window.location.href = '/login' // Redirect to login page
          },
          onAutoClose: () => console.log('Toast closed automatically after timeout')
        });
      } else {
        toast.error('Error Updating Blog Privacy', { duration: 2000 });
      }
    } finally {
      setIsPrivateDialogOpen(false);
    }
  };

  const confirmUpdate = (id, isPrivate) => {
    setSelectedBlog({ id, isPrivate });
    setIsPrivateDialogOpen(true);
  };

  useEffect(() => {
    const getallblogs = async () => {
      try {
        const res = await axios.get(`${base_url}/api/userblog/${username}`);
        setBlogs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    getallblogs();
  }, [username, base_url]);

  useEffect(() => {
    if (blogs.length > 0) {
      const mostLikedBlog = blogs.reduce((mostLiked, blog) => {
        return blog.likes.likedby.length > mostLiked.likes.likedby.length ? blog : mostLiked;
      }, blogs[0]);

      setLikedblog(mostLikedBlog);

      const mostCommentedBlog = blogs.reduce((mostCommented, blog) => {
        return blog.comments.length > mostCommented.comments.length ? blog : mostCommented;
      }, blogs[0]);

      setCommentedBlog(mostCommentedBlog);
    } else {
      setLikedblog({
        author: "Default Author",
        title: "Default Title",
        date: "Default Date",
      });
      setCommentedBlog({
        author: "Default Author",
        title: "Default Title",
        date: "Default Date",
      });
    }
  }, [blogs]);

  return (
    <div>
      <Toaster position="top-center" />
      <div className="container-tag my-16 w-[1400px] flex">
        <div className="dashitems w-[1000px]">
          <div className="metrics ml-36 flex mr-20 justify-between px-8 py-6 rounded-3xl">
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
            <div className="views flex flex-col">
              <div className='flex gap-2 items-center'>
                <h2 className='text-xl'>Views</h2>
                <FontAwesomeIcon icon={faEye} className='mt-1' style={{ width: '26px', height: '26px' }} />
              </div>
              <p className='text-6xl mx-4 my-3 text-zinc-600'>{blogs.reduce((total, blog) => total + (blog.views?.count || 0), 0)}</p>
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
            { isLoading ? (
              <div className="loadderr ml-36 mr-16 mt-6"><MainblogLoader/></div>
            ) : blogs.length > 0 ? (
              blogs.map((blog) => (
                <div className="blogs ml-36 mr-16" key={blog._id}>
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
                      { blog.isPrivate && 
                        <div className="isArchived ml-3 text-gray-400 px-2 border-2 rounded-2xl text-sm items-center">
                          <p>Private</p>
                        </div>
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
                      <FontAwesomeIcon icon={faEdit} className='nav__item-icon' onClick={() => openEditDialog(blog)} />
                      <span className="nav__item-text">Edit</span>
                    </div>
                    <div className="nav__item cursor-pointer">
                      <FontAwesomeIcon icon={faTrash} className='nav__item-icon' onClick={() => openDeleteDialog(blog._id)} />
                      <span className="nav__item-text">Delete</span>
                    </div>
                    <div className="nav__item cursor-pointer">
                      <FontAwesomeIcon icon={faUserSecret} className='nav__item-icon' onClick={() => confirmUpdate(blog._id, blog.isPrivate)} />
                      <span className="nav__item-text">Private</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-blog mx-52 w-[400px] text-lg ">Looks like there are no blogs created by the user yet. Start writing and share your thoughts with the world!</div>
            )}
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
      <PrivateToggleDialog
        isOpen={isPrivateDialogOpen}
        onClose={() => setIsPrivateDialogOpen(false)}
        onConfirm={handleConfirmPrivate}
        isPrivate={selectedBlog?.isPrivate}
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmdeletex}
      />
       <EditConfirmationDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onConfirm={handleConfirmEdit}
        blogTitle={blogToEdit?.title}
      />
    </div>
  );
}