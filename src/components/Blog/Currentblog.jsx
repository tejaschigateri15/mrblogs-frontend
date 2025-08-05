import { useParams } from 'react-router-dom';
import '../css/Currentblog.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faBookmark, faComment, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { Toaster, toast } from 'sonner'
import Test2 from '../user-credientials/Test2';
import { TextGenerateEffect } from '../../UI/TextGenerateEffect';
import Cookies from 'js-cookie';
import Titleloader from '../Utils/Titleloader';
import { Skeleton } from '@mui/material';
import { blueGrey } from '@mui/material/colors';



export default function Currentblog() {

  const base_url = import.meta.env.VITE_URL || 'http://localhost:8080';

  const username = useSelector((state) => state.user_info.username);

  const paramss = useParams();
  const [blog, setBlog] = useState({});
  const [date, setDate] = useState('');
  const [blogbody, setBlogbody] = useState('');
  const [comment, setComment] = useState('');
  const [allcomments, setAllcomments] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [summarizedText, setSummarizedText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const accessToken = useSelector(state => state.user_info.accessToken);
  const asc = Cookies.get('accessToken')
  const commentSectionRef = useRef(null);


  const formdata = {
    blog_id: paramss.id,
    username: username,
    // user_img: user_img,
    comment: comment,
  };



  const calculateTimeDifference = (commentTime) => {
    // Convert comment time string to a Date object
    const commentDate = new Date(commentTime);

    // Get the current time
    const currentDate = new Date();

    // Calculate the time difference in milliseconds
    const timeDifference = currentDate - commentDate;

    // Calculate the time difference in seconds, minutes, hours, days, weeks, months, and years
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    // Return the time difference as a string
    if (seconds < 60) {
      return 'few seconds ago';
    } else if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (days < 7) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (weeks < 4) {
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (months < 12) {
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  }

  const handleCommentIconClick = () => {
    commentSectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };



  const handleComment = async () => {
    if (asc) {
      if (!comment.trim()) {
        toast.error('Please enter a comment', { duration: 2000 });
        return;
      }

      setIsCommenting(true);
      try {
        const testaccessToken = Cookies.get('testaccessToken');
        if (!testaccessToken) {
          toast.error('Test access token is missing. Please login again.', { duration: 2000 });
          return;
        }
        
        const res = await axios.post(
          `${base_url}/api/postcomment`, 
          formdata,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'X-TestAccessToken': `Bearer ${testaccessToken}`
            },
          }
        );
        
        if (res.data) {
          toast.success('Comment posted successfully', { duration: 2000 });
          setComment('');
          setTimeout(() => { window.location.reload() }, 2000);
        }
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 401) {
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
          toast.error('Failed to post comment. Please try again.', { duration: 2000 });
        }
      } finally {
        setIsCommenting(false);
      }
    } else {
      toast.error('Please login to comment on the blog', { duration: 2000 });
    }
  };

  useEffect(() => {
    const fetchblog = async () => {
      try {
        const res = await axios.get(`${base_url}/api/getblog/${paramss.id}`);
        // console.log(res.data);
        const { author, author_img, body, date, title, blog_image, category, tags } = res.data;
        setBlog({ author, author_img, body, date, title, blog_image, category, tags });
        setDate(date.slice(0, 10));
        // setBlogbody(body.replace(/<\/p>/g, '</p><br/>'));
        const processedBody = body
          .replace(/<\/p>/g, '</p><br/>') 
          .replace(/<\/h1>/g, '</h1><br/>')
          .replace(/<\/h2>/g, '</h2><br/>')
          .replace(/<\/h3>/g, '</h3><br/>')
          .replace(/<h1>/g, '<h1 style="font-size: 28px; font-weight: bold;">') 
          .replace(/<h2>/g, '<h2 style="font-size: 24px; font-weight: bold;">') 
          .replace(/<h3>/g, '<h3 style="font-size: 20px; font-weight: bold;">')
          .replace(/(<a href=".+?">.*?<\/a>)/g, '<span style="color: #007bff;">$1</span>');

        setBlogbody(processedBody);

        setAllcomments(res.data.comments);

        const readingTime = calculatereadtime(body);
        setReadTime(readingTime);
      } catch (err) {
        console.error(err);
      }
    };

    fetchblog();

    const fetchlikesandsaved = async () => {
      try {
        const res = await axios.get(`${base_url}/api/getlikesandsaved`, {
          params: {
            username: username,
            blog_id: paramss.id
          }
        })
        if (res.data) {
        
          const { liked, saved } = res.data;
          setIsLiked(liked);
          setIsSaved(saved);
         
        }
      } catch (error) {
        console.error('Error fetching likes and saved status:', error);
        // Don't show toast for this as it's not critical and runs in background
      }
    }

    if (typeof asc !== 'undefined') {
      fetchlikesandsaved();
    }



  }, [paramss.id, base_url, username, asc]);

  const [readTime, setReadTime] = useState(0);


  const calculatereadtime = (blogbody) => {
    const wordCount = blogbody.split(/\s+/).length;
    const averageReadingSpeed = 250;
    const estimatedReadingTime = Math.ceil(wordCount / averageReadingSpeed);
    return estimatedReadingTime;
  };

  const handleLike = async () => {
    if (asc) {
      setIsLiking(true);
      try {
        const testaccessToken = Cookies.get('testaccessToken');
        if (!testaccessToken) {
          toast.error('Test access token is missing. Please login again.', { duration: 2000 });
          return;
        }
        
        const res = await axios.post(
          `${base_url}/api/togglelike`, 
          { blog_id: paramss.id, username: username },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'X-TestAccessToken': `Bearer ${testaccessToken}`
            },
          }
        );
        
        if (res.data) {
          // Use the response from backend for consistency
          const newLikeState = res.data.isLiked;
          const message = res.data.message || (newLikeState ? 'Blog liked successfully' : 'Blog unliked successfully');
          
          toast.success(message, { duration: 2000 });
          setIsLiked(newLikeState);
        }
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 401) {
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
          const action = isLiked ? 'unlike' : 'like';
          toast.error(`Failed to ${action} the blog. Please try again.`, { duration: 2000 });
        }
      } finally {
        setIsLiking(false);
      }
    } else {
      toast.error('Please login to like the blog', { duration: 2000 });
    }
  }

  const handleSummarize = async () => {
    if (asc) {
      // Reset states at the beginning of each summarize request
      setIsClicked(true);
      setIsLoading(false);
      setSummarizedText('');
      
      try {
        const testaccessToken = Cookies.get('testaccessToken');
        if (!testaccessToken) {
          toast.error('Test access token is missing. Please login again.', { duration: 2000 });
          return;
        }
  
        const res = await axios.post(
          `${base_url}/api/summarize`, 
          { body: blogbody }, 
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'X-TestAccessToken': `Bearer ${testaccessToken}`
            },
          }
        );
        
        if (res.data) {
          const cleanedHtmlCode = res.data.replace(/^```html\s*|\s*```$/g, '');
          setSummarizedText(cleanedHtmlCode);
          setIsLoading(true);
        }
      } catch (err) {
        console.error(err);
        // Reset states on error
        setIsClicked(false);
        setIsLoading(false);
        setSummarizedText('');
        
        if (err.response && err.response.status === 401) {
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
          toast.error('Failed to summarize the blog. Please try again.', { duration: 2000 });
        }
      }
    } else {
      toast.error('Please login to summarize the blog', { duration: 2000 });
    }
  }

  const handlesave = async (id) => {
    if (asc) {
      setIsSaving(true);
      try {
        const testaccessToken = Cookies.get('testaccessToken');
        if (!testaccessToken) {
          toast.error('Test access token is missing. Please login again.', { duration: 2000 });
          return;
        }

        const res = await axios.post(
          `${base_url}/api/togglesave`, 
          {
            username: username,
            blog_id: id
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'X-TestAccessToken': `Bearer ${testaccessToken}`
            },
          }
        );
      
        if (res.data) {
          // Use the response from backend for consistency
          const newSavedState = res.data.isSaved;
          const message = res.data.message || (newSavedState ? 'Blog saved successfully' : 'Blog unsaved successfully');
          
          toast.success(message, { duration: 2000 });
          setIsSaved(newSavedState);
        }
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 401) {
          toast.error('Session expired. Please login again to continue.', {
            duration: 3000,
            dismissible: true,
            action: {
              label: 'Login',
              onClick: () => window.location.href = '/login'
            },
            onAutoClose: () => console.log('Toast closed automatically after timeout')
          });
        } else {
          const action = isSaved ? 'unsave' : 'save';
          toast.error(`Failed to ${action} the blog. Please try again.`, { duration: 2000 });
        }
      } finally {
        setIsSaving(false);
      }
    }
    else {
      toast.error('Please login to save the blog', { duration: 2000 });
    }
  }

  return (
    <div className="containere">
      <Toaster position="top-center" />
      <div className="maincenter">
        <div className="itemsblog">
          <div className="headers">
            <div className="mainblogtitle">
              <h1>{blog.title || <Titleloader/>}</h1>
            </div>
            <div className="blogauthinfo">
              <div className="blogauthimage">
                { blog.author_img && blog.author_img.length > 0 ? <img src={blog.author_img}  /> : <Skeleton variant="circular" width={40} height={40} />}
              </div>
              <div className="infoauthandblog">
                <div className="blogauthorname">
                  <h2>{ blog.author || <div className="skl -mt-2"><Skeleton width="120px" height={60} sx={{ bgcolor: blueGrey[100] }} className='text_loaderxx' /></div>}</h2>
                  <div className="blogcat">
                    <p>{blog.category || <div className="skl "> <Skeleton variant="rounded" width={50} height={30} /></div>  }</p>
                  </div>
                  <div className="bloghashtag">
                    <p>{blog.tags || <div className="skl "> <Skeleton variant="rounded" width={50} height={30} /></div> }</p>
                  </div>
                </div>
                <div className="blogdates">
                  <p>Published on {date || '2024-01-20'}</p>
                  <div className="minread">
                    <p>{readTime} min read</p>
                  </div>
                </div>
                <div className="likecommsave mt-6 flex gap-6">
                  <button onClick={handleLike} disabled={isLiking}>
                    <FontAwesomeIcon
                      icon={faHeart}
                      style={{
                        fontSize: "20px",
                        color: isLiked ? "red" : "rgb(220, 216, 216)",
                        cursor: isLiking ? "not-allowed" : "pointer",
                        opacity: isLiking ? 0.6 : 1
                      }}

                    />
                  </button>
                  <button>
                    <FontAwesomeIcon
                      icon={faComment}
                      style={{
                        fontSize: "20px",
                        color: "rgb(220, 216, 216)",
                      }}
                      onClick={handleCommentIconClick}
                    />
                  </button>
                  <button onClick={() => handlesave(paramss.id)} disabled={isSaving}>
                    <FontAwesomeIcon
                      icon={faBookmark}
                      style={{ 
                        fontSize: "20px", 
                        color: isSaved ? "black" : "rgb(220, 216, 216)",
                        cursor: isSaving ? "not-allowed" : "pointer",
                        opacity: isSaving ? 0.6 : 1
                      }}
                    />
                  </button>
                </div>
              </div>

            </div>

          </div>
          <div className="blog_photo">
            <img src={blog.blog_image} alt="" />
          </div>
          <div className="summarise flex justify-center">
            {!isClicked ? (
              <button className='flex gap-2 item-center justify-center bg-neutral-200 px-4 py-2 rounded-full ' onClick={handleSummarize}>
                <img src="/google-gemini-icon.png" alt="" width="25px" height="25px" />
                <p className='summarize'>Summarize this</p>
              </button>
            ) : (
              <div className="flex gap-4">
                <button className='flex gap-2 item-center justify-center bg-neutral-200 px-4 py-2 rounded-full ' onClick={handleSummarize}>
                  <img src="/google-gemini-icon.png" alt="" width="25px" height="25px" />
                  <p className='summarize'>Summarize again</p>
                </button>
                <button className='flex gap-2 item-center justify-center bg-blue-500 text-white px-4 py-2 rounded-full ' onClick={() => { setIsClicked(false); setIsLoading(false); setSummarizedText(''); }}>
                  <p>Back to Original</p>
                </button>
              </div>
            )}
          </div>
          <div className="mainblogbody">
            {!isClicked ? <div className="blog-bodies" dangerouslySetInnerHTML={{ __html: blogbody }}></div> : !isLoading ? <div className='text-loader'><Test2 /></div> : <TextGenerateEffect words={summarizedText} />}
            {/* <div className="summ_text" dangerouslySetInnerHTML={{ __html: summarizedText }}></div> */}
          </div>
          <div className="comment-section" ref={commentSectionRef}>
            <div className="comment_title">
              <h2>Comment </h2>
            </div>
            <div className="commentbox">
              <input 
                type="text" 
                placeholder="Post your comment" 
                value={comment}
                onChange={(e) => setComment(e.target.value)} 
              />
              <button className="shadow-md cccc" onClick={handleComment} disabled={isCommenting}>
                {isCommenting ? 'Posting...' : 'Post'} <FontAwesomeIcon icon={faArrowUp} />
              </button>
            </div>
            <div className="showcomments">
              {allcomments && allcomments.length > 0 ? (
                allcomments.map((blogcomments) => (
                  <div className="commentsbody" key={blogcomments._id}>
                    <div className="authorr_info">
                      <div className="authimages">
                        <img src={blogcomments.user_img } alt="" />
                      </div>
                      <div className="authhh_info">
                        <div className="authnames">
                          <p>{blogcomments.username }</p>
                        </div>
                        <div className="commentdates">
                          <p>{calculateTimeDifference(blogcomments.date) }</p>
                        </div>
                      </div>
                    </div>
                    <div className="commentbodyy">
                      <p>{blogcomments.comment }</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="nocomments"><p>Looks like it&apos;s quiet here. Why not start the conversation?</p></div>
              )}
            </div>


          </div>
          {/* <div className="mainfooter">footer</div> */}
        </div>
      </div>
    </div>
  );
}
