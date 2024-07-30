import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Editor } from '@tinymce/tinymce-react';
import { 
  Button, 
  TextField, 
  Chip, 
  Avatar, 
  ThemeProvider, 
  createTheme,
  CssBaseline
} from '@mui/material';
import { styled } from '@mui/system';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faImages, 
  faPalette, 
  faCheck, 
  faTimes 
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Cookies from 'js-cookie';

// Styled components
const Container = styled(motion.div)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: '1000px',
  margin: '0 auto',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(6),
  },
}));

const Header = styled('header')(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
}));

const Title = styled(motion.h1)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
  [theme.breakpoints.up('md')]: {
    fontSize: '3rem',
  },
}));

const Subtitle = styled('p')(({ theme }) => ({
  fontSize: '1.2rem',
  fontStyle: 'italic',
  color: theme.palette.text.secondary,
}));

const CoverImageContainer = styled(motion.div)(({ theme }) => ({
  height: '250px',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  backgroundColor: theme.palette.grey[200],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  marginBottom: theme.spacing(3),
}));

const EditorContainer = styled(motion.div)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const TagsContainer = styled(motion.div)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const CategoryContainer = styled(motion.div)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const ActionContainer = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const UserInfoContainer = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(4),
}));

const InteractiveBlogCreator = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [themeMode, setThemeMode] = useState('light');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useSelector(state => state.user_info);
  const accessToken = Cookies.get('accessToken');

  const categories = [
    'Technology', 'Travel', 'Food', 'Lifestyle', 'Fashion', 'Health', 'Business', 'Entertainment'
  ];

  const theme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  useEffect(() => {
    document.body.className = themeMode;
  }, [themeMode]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCoverImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleTagInput = (event) => {
    if (event.key === 'Enter' && event.target.value) {
      setTags([...tags, event.target.value]);
      event.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Implement your submission logic here
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Blog submitted:', { title, content, tags, category, coverImage });
      // Reset form or redirect user
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <Title
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Create Your Masterpiece
          </Title>
          <Subtitle>Let your creativity flow and inspire the world</Subtitle>
        </Header>

        <CoverImageContainer
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => document.getElementById('coverImageInput').click()}
        >
          {coverImage ? (
            <img src={coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <FontAwesomeIcon icon={faImages} style={{ fontSize: '3rem', color: theme.palette.text.secondary }} />
          )}
        </CoverImageContainer>
        <input
          type="file"
          id="coverImageInput"
          hidden
          onChange={handleImageUpload}
          accept="image/*"
        />

        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginBottom: theme.spacing(3) }}
            InputProps={{
              style: { fontSize: '1.5rem', fontWeight: 'bold' }
            }}
          />
        </motion.div>

        <EditorContainer
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Editor
            apiKey="your-tinymce-api-key"
            init={{
              height: 500,
              menubar: false,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
              ],
              toolbar:
                'undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help'
            }}
            onEditorChange={(content) => setContent(content)}
          />
        </EditorContainer>

        <TagsContainer
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <TextField
            label="Add tags"
            variant="outlined"
            fullWidth
            onKeyPress={handleTagInput}
            placeholder="Press Enter to add tags"
            style={{ marginBottom: theme.spacing(1) }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing(1) }}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => removeTag(tag)}
                color="primary"
                variant="outlined"
              />
            ))}
          </div>
        </TagsContainer>

        <CategoryContainer
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p style={{ marginBottom: theme.spacing(1), fontWeight: 'bold' }}>Category</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing(1) }}>
            {categories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                onClick={() => setCategory(cat)}
                color={category === cat ? 'primary' : 'default'}
                variant={category === cat ? 'filled' : 'outlined'}
              />
            ))}
          </div>
        </CategoryContainer>

        <ActionContainer
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={isSubmitting}
            startIcon={isSubmitting ? <FontAwesomeIcon icon={faCheck} spin /> : null}
          >
            {isSubmitting ? 'Publishing...' : 'Publish Blog'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
            startIcon={<FontAwesomeIcon icon={faPalette} />}
          >
            Toggle Theme
          </Button>
        </ActionContainer>

        {user && (
          <UserInfoContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <Avatar src={user.profile_pic} alt={user.username} style={{ marginRight: theme.spacing(2) }} />
            <div>
              <p style={{ fontWeight: 'bold' }}>{user.username}</p>
              <p style={{ fontSize: '0.9rem', color: theme.palette.text.secondary }}>Ready to inspire?</p>
            </div>
          </UserInfoContainer>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default InteractiveBlogCreator;