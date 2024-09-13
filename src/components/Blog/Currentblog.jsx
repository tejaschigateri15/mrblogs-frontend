import { useParams } from 'react-router-dom';
import '../css/Currentblog.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faBookmark, faComment, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster, toast } from 'sonner'
import { set_user_info } from '../state';
import Test2 from '../user-credientials/Test2';
import { TextGenerateEffect } from '../../UI/TextGenerateEffect';
import Cookies from 'js-cookie';
import Titleloader from '../Utils/Titleloader';
import { Skeleton } from '@mui/material';
import { blueGrey } from '@mui/material/colors';



export default function Currentblog() {

  const base_url = import.meta.env.VITE_URL || 'http://localhost:8080';

  const username = useSelector((state) => state.user_info.username);
  const user_img = useSelector((state) => state.user_info.profile_pic);
  const dispatch = useDispatch()

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
      try {
        const res = await axios.post(`${base_url}/api/postcomment`, formdata);
        if (res.data) {
          // console.log('comment posted successfully');
          toast.success('Comment posted successfully', { duration: 2000 });
          setTimeout(() => { window.location.reload() }, 2000)

        }
        setComment('');
      } catch (err) {
        console.error(err);
      }
    }
    else {
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

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${base_url}/getprofile`, {
          params: {
            username: username
          }
        });

        const { name, profile_pic } = response.data;
        dispatch(set_user_info({ username, id: '1', profile_pic }));

      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    // fetchProfile();

    const fetchlikesandsaved = async () => {
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

    }

    if (typeof asc !== 'undefined') {
      fetchlikesandsaved();
    }



  }, [paramss.id]);

  const [readTime, setReadTime] = useState(0);


  const calculatereadtime = (blogbody) => {
    const wordCount = blogbody.split(/\s+/).length;
    const averageReadingSpeed = 250;
    const estimatedReadingTime = Math.ceil(wordCount / averageReadingSpeed);
    return estimatedReadingTime;
  };

  const handleLike = async () => {
    if (asc) {
      try {
        const res = await axios.post(`${base_url}/api/likeblog`, { blog_id: paramss.id, username: username });
        if (res.data) {
          toast.success('Blog liked successfully', { duration: 2000 });
          setIsLiked(true)
        }
      } catch (err) {
        console.error(err);
      }
    }
    else {
      toast.error('Please login to like the blog', { duration: 2000 });
    }
  }

  const handleSummarize = async () => {
    if (asc) {

      setIsClicked(true)
      try {
        const res = await axios.post(`${base_url}/api/summarize`, { body: blogbody });
      
        if (res.data) {
          setIsLoading(true);
          const cleanedHtmlCode = res.data.replace(/^```html\s*|\s*```$/g, '');
          setSummarizedText(cleanedHtmlCode);
          
        }
      } catch (err) {
        console.error(err);
      }
    }
    else {
      toast.error('Please login to summarize the blog', { duration: 2000 });
    }
  }

  const handlesave = async (id) => {
    if (asc) {
      try {
        const res = await axios.post(`${base_url}/api/saveblog`, {
          username: username,
          blog_id: id
        });
      
        if (res.data) {
          toast.success('Blog saved successfully');
          setIsSaved(true);

        }

      } catch (err) {
        console.error(err);
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
                  <button onClick={handleLike}>
                    <FontAwesomeIcon
                      icon={faHeart}
                      style={{
                        fontSize: "20px",
                        color: isLiked ? "red" : "rgb(220, 216, 216)",
                        cursor: "pointer"
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
                  <button onClick={() => handlesave(paramss.id)}>
                    <FontAwesomeIcon
                      icon={faBookmark}
                      style={{ fontSize: "20px", color: isSaved ? "black" : "rgb(220, 216, 216)", }}
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
            <button className='flex gap-2 item-center justify-center bg-neutral-200 px-4 py-2 rounded-full ' onClick={handleSummarize}><img src="/google-gemini-icon.png" alt="" width="25px" height="25px" /><p className='summarize'>Sumarize this</p></button>
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
              <input type="text" placeholder="Post your comment" onChange={(e) => setComment(e.target.value)} />
              <button className="shadow-md cccc" onClick={handleComment}>
                Post <FontAwesomeIcon icon={faArrowUp} />
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
                <div className="nocomments"><p>Looks like it's quiet here. Why not start the conversation?</p></div>
              )}
            </div>


          </div>
          {/* <div className="mainfooter">footer</div> */}
        </div>
      </div>
    </div>
  );
}
