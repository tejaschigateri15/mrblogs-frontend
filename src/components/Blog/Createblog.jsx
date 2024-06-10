import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../css/createblog.css';
import Select from 'react-select';
import { Button, TextField } from '@mui/material';
import { Typewriter } from 'react-simple-typewriter';
import axios from 'axios';
import { Toaster, toast } from 'sonner'
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faImages } from '@fortawesome/free-solid-svg-icons';
// import { Link } from 'react-router-dom';
import { Image } from 'react-image-and-background-image-fade'
import CircularProgress from '@mui/material/CircularProgress';
import Cookies from 'js-cookie';


export default function Createblog() {

    const base_url = import.meta.env.VITE_URL || 'http://localhost:8080';

    const [text, setText] = useState('');
    const [title, setTitle] = useState('');
    const [tag, setTag] = useState('');
    const [category, setCategory] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [image, setImage] = useState(null);
    const user_info = useSelector(state => state.user_info);
    // const accessToken = useSelector(state => state.user_info.accessToken);
    const { username } = user_info;  // current name of logged in user
    const profileimage = useSelector(state => state.user_info.profile_pic)  // current profile image of logged in user

    const accessToken = Cookies.get('accessToken')
    const formdata = {
        author: username,
        author_img: profileimage,
        image: image,
        title: title,
        // content: sanitizeHTML(text),
        content: text,
        tag: tag,
        category: category
    };

    const handleSubmit = async () => {
        if(accessToken){
            try {
                if(!image){
                    toast.error('Please select an image');
                    return;
                }
                if(!title){
                    toast.error('Please enter title');
                    return;
                }
                if(!text){
                    toast.error('Please enter content');
                    return;
                }
                if(!tag){
                    toast.error('Please enter tag');
                    return;
                }
                if(!category){
                    toast.error('Please select category');
                    return;
                }
                const res = await axios.post(`${base_url}/api/createblog`, formdata,{
                    params: {
                        accessToken: accessToken
                    }
                });
                // console.log("formdata = ", res.data);
                <Toaster position="top-center" />
                // toast('Image selected 👍',filename)

                setImage(null)
                setTitle('')
                setText('')
                setTag('')
                setCategory('')


                toast.success('Blog created successfully 👍',{duration:2000})

            } catch (err) {
                console.log(err);
                toast.error('An error occurred during the upload process. Please try again, or consider logging in again.'); 

            }
        }
        else{
            toast.error('Please login first');
        }
    };

    const options = [
        { value: 'Technology', label: 'Technology' },
        { value: 'Movies', label: 'Movies' },
        { value: 'Science', label: 'Science' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Programming', label: 'Programming' },
        { value: 'Business', label: 'Business' },
        { value: 'World', label: 'World' },
        { value: 'Automobile', label: 'Automobile' },
        { value: 'Culture', label: 'Culture' },
        { value: 'Lifestyle', label: 'Lifestyle' },
        { value: 'Health', label: 'Health' },
        { value: 'Personal Development', label: 'Personal Development' }
    ];

    const handleCategoryChange = (selectedOption) => {
        setCategory(selectedOption?.value || '');
    };
    // const [filename, setFilename] = useState('Choose File');
    const placeholder = 'Write something amazing...';

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];


    const uploadimage = async (image) => {
        // console.log("file : ",file);
        setIsUploading(true)
        const formdata = new FormData()
        formdata.append('file', image)
        formdata.append('upload_preset', "xw4yrog1")
        formdata.append('folder', 'testing')
        try{
        const photo = await axios.post('https://api.cloudinary.com/v1_1/di82vgpbo/image/upload', formdata)
        setImage(photo.data.url)
        
        image && toast.success('Image is uploaded👍',{duration:2000}) ,setIsUploading(false)
        // console.log("url : ", photo.data.url)
        }catch(err){
            console.log(err);
        }
    }


    return (
        <div className='write-blog'>
            <div className="rightoptions">
                <div className="profilesettings">
                    <div className="profilesettingname"><h2>Image Preview</h2></div>
                    {/* <div className="profilelinks">
            <Link to="/editprofile"><p>EDIT PROFILE <FontAwesomeIcon icon={faEdit} /></p></Link>
            <Link to='/'><p>LOGOUT <FontAwesomeIcon icon={faSignOut} /></p></Link>
          </div> */}
                    <div className="image-prev">
                        {image ? <Image src={image} alt="Image not selected" height='100%' lazyLoad /> : !isUploading ?<div className='imagetext'><p>Image not selected</p></div>: <div className="spinner"> <CircularProgress style={{ color: '#7856FF' }} /></div> }
                    </div>
                </div>
            </div>
            <div className="quote">
                <Typewriter
                    words={["Write about what makes you passionate - let your enthusiasm inspire others!"]}
                    loop={false}
                    cursor
                    cursorStyle='_'
                    typeSpeed={70}
                    deleteSpeed={50}
                    delaySpeed={1000}
                />
            </div>
            <div className="authorprofile">
                <div className="authorname">
                    <div className="authorimage"><img src={profileimage||"Default_pfp.svg.webp"} alt="" /></div>
                    <div className="authornamee"><p>@{username || "user"}</p></div>
                </div>
            </div>
            <div className="blogedit">
                <div className="blogtitle">
                    <div className="uploadblogimg" ><div className="uploadericon"><label htmlFor="image"><FontAwesomeIcon icon={faImages} style={{ color: "#7856FF", width: "60px", fontSize: '1.5em' }} /> <p>Upload</p> </label></div>
                        {/* <div className="filename"><p>{filename}</p></div> */}
                    </div>

                    <div className="uploader">
                        <TextField
                            name="upload-photo"
                            type="file"
                            className="llb"
                            id='image'
                            required
                            onChange={(e) => uploadimage(e.target.files[0])}
                        />
                    </div>
                    <TextField
                        id="title"
                        label="Title"
                        variant="standard"
                        InputLabelProps={{ style: { color: '#546e7a' } }}
                        name='title'
                        value={title}
                        className='blog-title'
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="blogbodye">
                    <div className="blog_bd">
                        <ReactQuill
                            theme="snow"
                            modules={modules}
                            formats={formats}
                            value={text}
                            onChange={setText}
                            placeholder={placeholder}
                            style={{ width: "100%" }}
                        />
                    </div>
                    <div className="categoriess">
                        <TextField
                            id="tags"
                            label="Add tag (#fashion #sports)"
                            variant="standard"
                            InputLabelProps={{ style: { color: '#546e7a' } }}
                            name='tags'
                            className='tags'
                            onChange={(e) => setTag(e.target.value)}
                            value={tag}
                        // style={{width: "100%"}}
                        />
                        <Select
                            options={options}
                            placeholder='categories'
                            className='select'
                            onChange={handleCategoryChange}
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}  // Adjust the zIndex value
                        />

                    </div>
                </div>
            </div>
            <div className="submit">
                <Toaster position="top-center" />
                <Button
                    style={{
                        borderRadius: 35,
                        backgroundColor: "#7856ff",
                        padding: "10px",
                        fontSize: "15px",
                        width: "300px",
                        textAlign: "center",
                        transition: 'box-shadow 0.3s',
                        boxShadow: 'none',
                        marginTop: '60px'
                    }}
                    variant="contained"
                    onMouseOver={(e) => e.currentTarget.style.boxShadow = '0px 0px 10px 0px rgba(120, 86, 255, 0.75)'}
                    onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </div>
            {/* <div className="sanitized-content">{sanitizeHTML(text)}</div> */}
            {/* <div className="raw">{text}</div> */}
            {/* <div dangerouslySetInnerHTML={{ __html: text }} /> */}
        </div>
    );
}
