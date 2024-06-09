import axios from 'axios';
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
// import ScrollMenu from 'react-horizontal-scroll-menu';
import CommentsLoader from '../user-credientials/CommentsLoader';
import '../css/comments.css'

export default function ShowComments() {

  const [allcomments, setAllcomments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user_info = useSelector(state => state.user_info);
  const { username } = user_info;
  const {id} = user_info;
  // const 

  useEffect(() => {
    const getcomments = async () => {
      try {
        const response = await axios.get(`https://testingfinal.onrender.com/api/getallcomments/${username}`);
        setAllcomments(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error(error);
      }
      finally {
        setIsLoading(false);
    }
    };
    getcomments();
    // console.log("username", id);
  }, [])

  const calculateTimeDifference = (commentTime) => {

    const commentDate = new Date(commentTime);

    // Get the current time
    const currentDate = new Date();


    const timeDifference = currentDate - commentDate;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);


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

  const list = [
    { name: 'item1' },
    { name: 'item2' },
    { name: 'item3' },
    { name: 'item4' },
    { name: 'item5' },
    { name: 'item6' },
    { name: 'item7' },
    { name: 'item8' },
    { name: 'item9' }
  ];

  return (
    <div>
      <div className="mantain">
        <div className="main_allblog">
          <div className="showcomments ">
            { isLoading ?  <CommentsLoader/> : allcomments && allcomments.length > 0 ? (
              allcomments.map((blogcomments) => (
                <div className="commentsbody" key={blogcomments._id}>
                  <div className="authorr_info">
                    <div className="authimages">
                      <img src={blogcomments.user_img || 'pxfuel.jpg'} alt="" />
                    </div>
                    <div className="authhh_info">
                      <div className="authnames">
                        <p>{blogcomments.username || 'Ravi Sharma'}</p>
                      </div>
                      <div className="commentdates">
                        <p>{calculateTimeDifference(blogcomments.date) || "1 day ago"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="commentbodyy">
                    <p>{blogcomments.comment || 'yeah its actually a very good idea even I was also thinking the same and it will give benefit for everyone '}</p>
                  </div>
                </div>
              )) 
            ) : (
              <div className="nocomments mr-36"><p>The blogs you've shared seem to be as quiet as a library 📚, lacking any comments or feedback 🤔. </p></div>
            )  }
             {/* <CommentsLoader /> */}
          </div>
        </div>

      </div>
    </div>
  )
}

