// import toast from 'react-hot-toast';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import '../css/editprofile.css'
import { SocialIcon } from 'react-social-icons'
import { useDispatch, useSelector, } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faUpload } from '@fortawesome/free-solid-svg-icons';
import { set_user_info } from '../state';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import CircularProgress from '@mui/material/CircularProgress';

export default function Twstest() {

  const base_url = import.meta.env.VITE_URL || 'http://localhost:8080';

  const [image, setImage] = useState(null);
  const username = useSelector(state => state.user_info.username)
  const id = useSelector(state => state.user_info.id)
  const [fetchedName, setFetchedName] = useState('');
  const [fetchedphoneno, setFetchedphoneno] = useState('');
  const [fetchedBio, setFetchedBio] = useState('');
  const [fetchedInsta, setFetchedInsta] = useState('');
  const [fetchedLinkedin, setFetchedLinkedin] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch()


  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("image : ",image);

    if (!fetchedName || !fetchedphoneno || !fetchedBio || !fetchedInsta || !fetchedLinkedin || !image) {
      toast.error('Please fill all the fields'); // Display an error toast in case of an error
      return
    }


    const instagramRegex = /https?:\/\/(www\.)?instagram\.com\/([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)/;
    const linkedinRegex = /https?:\/\/(www\.)?linkedin\.com\/([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)/;

    if (!linkedinRegex.test(fetchedLinkedin)) {
      toast.error('Invalid Linkedin link');
      return
    }
    if (fetchedphoneno.length !== 10) {
      toast.error('Invalid phone number');
      return
    }
    if (!instagramRegex.test(fetchedInsta)) {
      toast.error('Invalid Instagram link');
      return
    }


    try {
      const formData = new FormData();
      formData.append('name', fetchedName);
      formData.append('phoneno', fetchedphoneno);
      formData.append('bio', fetchedBio);
      formData.append('insta', fetchedInsta);
      formData.append('linkedin', fetchedLinkedin);
      formData.append('username', username);
      formData.append('image', image);

      const formdatas = {
        name: fetchedName,
        phoneno: fetchedphoneno,
        bio: fetchedBio,
        insta: fetchedInsta,
        linkedin: fetchedLinkedin,
        username: username,
        image: image,

      }

      const res = await axios.post(`${base_url}/upload`, formdatas);

      // console.log("Response:", res.data);
      dispatch(set_user_info({ fetchedName, id, image }))
      toast.success('Profile updated successfully', { duration: 2000 })
      setTimeout(() => { navigate('/login') }, 2000)


    } catch (err) {
      console.error("Error:", err);
      toast.error('Error during upload'); // Display an error toast in case of an error
    }
  };

  const uploadimage = async (image) => {
    // console.log("file : ",file);

    const formdata = new FormData()
    formdata.append('file', image)
    formdata.append('upload_preset', "xw4yrog1")
    formdata.append('folder', 'blog_images')
    try {
      setIsUploading(true)
      const photo = await axios.post('https://api.cloudinary.com/v1_1/di82vgpbo/image/upload', formdata)
      setImage(photo.data.url)
      image && toast.success('Image is uploaded👍', { duration: 2000 }), setIsUploading(false)
      // console.log("url : ", photo.data.url)
    } catch (err) {
      console.log(err)
    }

  }


  return (
    <div>
      <Toaster position="top-center" />
      <div className="editwrapper">

        <div className="uploadImage">
          {/* <div className="imagePreview">
        
          <img
            className="previewImage"
            src={image}
            alt=""
            width="400px"
            height="600px"
          /> 
          </div> */}
          <div className="imagebox">
            {image ? <img src={image} alt="" /> : !isUploading ? <div className='imagetextx'><p>Image not selected</p></div> : <div className="spinner"> <CircularProgress style={{ color: '#7856FF' }} /></div>}
          </div>

          <form action="" encType="multipart/form-data" >
            <div className="imgupl"><label htmlFor="image">Upload  <FontAwesomeIcon icon={faUpload} style={{ color: "#B197FC", }} /></label> </div>
            <div className="uploader">
              <TextField
                name="upload-photo"
                type="file"
                className="llb"
                id='image'
                onChange={(e) => uploadimage(e.target.files[0])}
              />

            </div>
            {/* <button type="submit" style={{ color: 'red', backgroundColor: 'black' }}>
              Click me
            </button> */}
          </form>
        </div>

        <div className="editdetails">
          <div className="detailswrap">
            <div className="mainhead"><h2>Edit Profile    <FontAwesomeIcon icon={faEdit} /></h2></div>
            <div className="inputsy">
              <div className="editname"><TextField id='name' label={!username || "Name"} variant="standard" onChange={(e) => setFetchedName(e.target.value)} /></div>
              <div className="editemail"><TextField id='name' label="Mobile" variant="standard" onChange={(e) => setFetchedphoneno(e.target.value)} /></div>
              <div className="inslink"> <TextField
                multiline
                rows={8}
                variant="outlined"
                label="Bio"
                onChange={(e) => setFetchedBio(e.target.value)}
              /></div>
              <div className="medialinks">
                <div className="linkbox"><div className="iconsocial"><SocialIcon url="https://instagram.com" style={{ width: '35px', height: '40px' }} /></div><TextField id='name' label="Instagram" variant="outlined" onChange={(e) => setFetchedInsta(e.target.value)} /></div>
                <div className="linkbox"><div className="iconsocial"><SocialIcon url="https://linkedin.com" style={{ width: '35px', height: '40px' }} /></div><TextField id='name' label="Linkedin" variant="outlined" onChange={(e) => setFetchedLinkedin(e.target.value)} /></div>
              </div>
            </div>
          </div>
          <Button variant="outlined" onClick={handleSubmit} style={{
            borderRadius: 35,
            backgroundColor: "#4CAF50",
            padding: "10px",
            fontSize: "15px",
            width: "200px",
            color: "#FFFFFF",
            textAlign: "center",
            transition: 'box-shadow 0.3s',
            boxShadow: 'none',
            border: 'none',
            marginLeft: "-150px",

          }}
            onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0px 0px 5px 0px rgba(76, 175, 80, 0.5)' }}
            onMouseOut={(e) => { e.currentTarget.style.boxShadow = 'none' }}
          >Save Changes</Button>
        </div>

      </div>
      {/* backgroundColor:"#03C03C" */}
    </div>
  );
}
