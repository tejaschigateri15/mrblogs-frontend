import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signin from './components/user-credientials/login.jsx';
import Signup from './components/user-credientials/signup.jsx';
import Home from './components/HomeComponent.jsx';
import ProfileDashboard from './components/user-credientials/profile.jsx';
import Createblog from './components/Blog/Createblog.jsx';
import Twstest from './components/user-credientials/Test.jsx';
import Mainpage from './components/Blog/Mainpage.jsx';
import Currentblog from './components/Blog/Currentblog.jsx';
import Profileblogs from './components/Blog/Profileblogs.jsx';
import Blogtopics from './components/Blog/Blogtopics.jsx';
import SavedBlogPage from './components/Blog/SavedBlogPage.jsx';
import BlogDashboard from './components/Blog/BlogDashboard.jsx';
import SavedBlogsxx from './components/Blog/SavedBlogs.jsx';
import ShowComments from './components/Blog/ShowComments.jsx';
import Editblog from './components/Blog/EditBlog.jsx';
import UseProfile from './components/Blog/UserProfile.jsx';
import ErrorPage from './Error.jsx';
import NewBlog from './components/Blog/NewBlog.jsx';
import ForgotPassword from './components/user-credientials/ForgotPassword.jsx';
import ResetPassword from './components/user-credientials/ResetPassword.jsx';
import Testsubscription from './components/Testsubscription.jsx';



function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Mainpage />} />
            <Route path="profile" element={<ProfileDashboard />}>
              <Route index element={<Profileblogs />} />
              <Route path="savedblog" element={<SavedBlogsxx />} />
              <Route path="comments" element={<ShowComments />} />
            </Route>
            <Route path="writeblog" element={<Createblog />} />
            <Route path="editblog/:id" element={<Editblog />} />
            <Route path="editprofile" element={<Twstest />} />
           
            {/* <Route path="test" element={<UseProfile />} /> */}
            <Route path="blogdashboard" element={<BlogDashboard />} />
            <Route path="blog/:id" element={<Currentblog />} />
            <Route path="topic/:tag" element={<Blogtopics />} />
            <Route path="all/savedblogs" element={<SavedBlogPage />} />
            <Route path="newblog" element={<NewBlog />} />

          </Route>
          <Route path="login" element={<Signin />} />
          <Route path="test" element={<Testsubscription />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="*" element={<ErrorPage />} />
          {/* <Route path="home" element={<Navbar/>}/> */}
          {/* <Route path="testing" element={<XApp/>}/> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
