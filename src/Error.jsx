import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon } from 'lucide-react';

const ErrorPage = () => {
  const navigate = useNavigate();
  const [position, setPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <Container maxWidth={false} disableGutters sx={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: `radial-gradient(circle at ${position.x}% ${position.y}%, #ffffff, #f0f0f0)`,
      transition: 'background 0.3s ease',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Animated background elements */}
      {[...Array(30)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: '2px',
            height: '2px',
            background: '#000',
            borderRadius: '50%',
            opacity: Math.random() * 0.5 + 0.5,
            animation: `float ${Math.random() * 10 + 10}s linear infinite`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
      
      <Box sx={{ 
        textAlign: 'center',
        p: 6,
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 4,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        maxWidth: '600px',
        width: '100%',
        border: '2px solid #000',
      }}>
        <Typography variant="h1" sx={{ 
          fontSize: { xs: '6rem', md: '8rem' }, 
          fontWeight: 700, 
          color: '#000',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          mb: 2,
          fontFamily:"'Exo 2', sans-serif",
        }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ color: '#000', mb: 4, fontFamily: "'Roboto', sans-serif" }}>
          Oops! The page you're looking for has wandered off.
        </Typography>
        <Typography variant="body1" sx={{ color: '#333', mb: 4, fontFamily: "'Roboto', sans-serif" }}>
          Don't worry, even the best stories have unexpected twists. Let's get you back on track.
        </Typography>
        
        <Button
          variant="outlined"
          color="inherit"
          size="large"
          onClick={() => navigate('/')}
          startIcon={<HomeIcon />}
          sx={{
            borderColor: '#000',
            color: '#000',
            '&:hover': {
              borderColor: '#000',
              bgcolor: 'rgba(0, 0, 0, 0.05)',
            },
            fontFamily: "'Roboto', sans-serif",
            textTransform: 'none',
            fontSize: '1rem',
            padding: '10px 20px',
          }}
        >
          Return to Homepage
        </Button>
      </Box>

      {/* CSS for floating animation */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;700&display=swap');
      `}</style>
    </Container>
  );
};

export default ErrorPage;