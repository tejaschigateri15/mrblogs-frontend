import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../css/mainpage.css';

export default function BlogOptions() {

    useEffect(() => {
        window.addEventListener('DOMContentLoaded', () => {
            const element = document.querySelector('#right');
            const maxHeight = 1230; // Maximum height threshold
        
            function handleScroll() {
                if (element.offsetHeight > maxHeight) {
                    element.style.position = 'sticky';
                    element.style.top = '0';
                    element.style.right = '0'; // Adjust as needed
                } else {
                    element.style.position = 'static'; // Reset to default position
                }
            }
        
            window.addEventListener('scroll', handleScroll);
            window.addEventListener('resize', handleScroll); // Handle resize events
        
            // Initial check
            handleScroll();
        });
        
    }, [])

  return (
    <div>
         <div className="right-contents ml-5" id='right'>
                    <div className="right-items">
                        <div className="top-picks">
                            <h2 className='mb-6 text-lg'>Top Blogs</h2>
                            <div className="top-picksimg mb-5">
                                <div className="top-headd flex items-center gap-3">
                                    <img src="pxfuel.jpg" alt=""  />
                                    <h3>Kushal Anburmatt</h3>
                                </div>
                                <div className="topick-title">
                                    <p>Top 30 JavaScript Interview Questions and Answers for 2024</p>
                                </div>
                            </div>
                            <div className="top-picksimg mb-5">
                                <div className="top-headd flex items-center gap-3">
                                    <img src="pxfuel.jpg" alt=""  />
                                    <h3>Kushal Anburmatt</h3>
                                </div>
                                <div className="topick-title">
                                    <p>Top 30 JavaScript Interview Questions and Answers for 2024</p>
                                </div>
                            </div>
                            <div className="top-picksimg mb-5">
                                <div className="top-headd flex items-center gap-3">
                                    <img src="pxfuel.jpg" alt=""  />
                                    <h3>Kushal Anburmatt</h3>
                                </div>
                                <div className="topick-title">
                                    <p>Top 30 JavaScript Interview Questions and Answers for 2024</p>
                                </div>
                            </div>
                            <div className="topics-link"><Link><p className='text-slate-500'>See the full list </p></Link></div>
                        </div>
                        <div className="startwriting mt-5 px-10 py-4 bg-gray-200 w-[240px] h-[200px]">
                            <div className="start-items">
                                <h2 className='font-bold mb-4'>Writing on Mr. Blogs</h2>
                                <p>Unleash Your Voice</p>
                                <p>Share Your Passion</p>
                                <p>Start Writing Today!</p>
                                <button className='bg-slate-800 text-white px-4 py-2 mt-4 rounded-full  '>Start Writing</button>
                            </div>
                        </div>
                        <div className="recommended-topics mt-10">
                            <h2 className='font-bold'>Recommended Topics</h2>
                            <div className="topics-rec flex flex-wrap gap-4 p-4 mr-20">
                                <div className="topic-item">Technology</div>
                                <div className="topic-item">Politics</div>
                                <div className="topic-item">Artificial Intelligence</div>
                                <div className="topic-item">Covid</div>
                                <div className="topic-item">Gaming</div>
                                <div className="topic-item">Architecture</div>
                                <div className="topic-item">Travel</div>
                                <div className="topic-item">Programming</div>
                                <div className="topic-item">Economics</div>
                                <div className="topic-item">Spiritual</div>
                            </div>
                            <div className="topics-link  mt-2"><Link><p className='text-slate-500'>See more topics </p></Link></div>
                        </div>
                        <div className="recently-saved mt-7">
                            <h2 className='font-bold mb-4'>Recently Saved</h2>
                            <div className="top-picksimg mb-5">
                                <div className="top-headd flex items-center gap-3">
                                    <img src="pxfuel.jpg" alt=""  />
                                    <h3>Kushal Anburmatt</h3>
                                </div>
                                <div className="topick-title">
                                    <p>Top 30 JavaScript Interview Questions and Answers for 2024</p>
                                </div>
                                <div className="blog-foot flex gap-6">
                                    <p className='save-min-readx'>Aug,19 2023</p>
                                    <p className='save-min-read'>3 min read</p>
                                </div>
                                <div className="topics-link mt-5 ">
                                    <Link><p className='text-slate-500'>See all (1)</p></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    </div>
  )
}
