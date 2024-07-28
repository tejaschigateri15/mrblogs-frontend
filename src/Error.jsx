import React from 'react';
import { Link } from 'react-router-dom';
// import '../css/Error.css';
// import './components/css/ErrorPage.css'

const ErrorPage = () => {
  return (
    <main className="error-page">
      <style>
        {`
              @font-face {
      font-family: 'pixel_en';
      src: url('Font_en.ttf') format('truetype');
    }
    
    @font-face {
      font-family: 'pixel_fa';
      src: url('Font_fa.ttf') format('truetype');
    }
    
    .error-page {
      height: 100vh;
      font-size: 16px;
      font-family: "pixel_en", "pixel_fa", "Consolas", "math", sans-serif;
      background: #000;
      color: #fff;
      overflow: hidden !important;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    
    .text_404 {
      display: flex;
      text-align: center;
      align-items: center;
      margin: 15px 0;
    }
    
    .text_404 h1 {
      margin: 0 10px;
      font-size: 7em;
    }
    
    .pixelated-image {
      width: 1.6em;
    }
    
    .description {
      letter-spacing: 3px;
      margin: 15px 0;
      font-size: 1rem;
    }
    
    .back-link {
      letter-spacing: 2px;
      text-align: center;
      margin: 15px 0;
      font-size: 0.8rem;
      text-decoration: none;
      color: #fff;
    }
    
    @media (min-width: 1024px) {
      .text_404 h1 {
        font-size: 10vw;
      }
      
      .description {
        font-size: 1.5vw;
      }
      
      .back-link {
        font-size: 1vw;
      }
    }
    
    @media (max-width: 768px) {
      .text_404 h1 {
        margin: 0 3px;
        font-size: 5em;
      }
      
      .description {
        font-size: 0.6em;
      }
      
      .back-link {
        font-size: 0.6em;
      }
    }
    
    @media (max-width: 300px) {
      .text_404 h1 {
        margin: 0;
        font-size: 4em;
      }
      
      .description {
        font-size: 0.5em;
      }
      
      .back-link {
        font-size: 0.5em;
      }
    }


          `}
      </style>
      <div className="text_404">
        <h1>4</h1>
        <h1>
          <span>
            <svg className="pixelated-image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
              <path
                fill="#fff"
                d="M593,53H377.043V186.985H243V548H593V53ZM455.234,283.752v-40.94h22.34v18.609h18.617V280.03h14.894V261.421H529.7V242.812h22.341v40.94H533.426v14.887h18.617v40.94H529.7V320.97H511.085V302.361H496.191V320.97H477.574v18.609h-22.34v-40.94h18.617V283.752H455.234Zm-171.277,0v-40.94H306.3v18.609h18.617V280.03h14.894V261.421h18.617V242.812h22.34v40.94H362.149v14.887h18.617v40.94h-22.34V320.97H339.809V302.361H324.915V320.97H306.3v18.609H283.957v-40.94h18.617V283.752H283.957Zm7.447,171.2V432.624h18.617V414.015h22.341V395.406H503.638v18.609h18.617v18.609H544.6v22.331H503.638V432.624H485.021V414.015H429.17v40.94H410.553v18.609H369.6V454.955H350.979V436.346H332.362v18.609H291.4Zm81.915-3.722H406.83v-33.5H373.319v33.5Zm-126.6-286.579H354.7V56.722H339.809V75.331H321.191V93.94H302.574v18.609H283.957v18.609H265.34v18.609H246.723v14.887Z"
              />
            </svg>
          </span>
        </h1>
        <h1>4</h1>
      </div>
      <p className="description">:( Oops! page not found</p>
      <p>
        <Link to="/" className="back-link">
          Back →
        </Link>
      </p>
    </main>
  );
};

export default ErrorPage;