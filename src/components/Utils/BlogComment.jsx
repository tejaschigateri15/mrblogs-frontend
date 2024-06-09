const blogcomment = (text)=>{
    // Regular expression to match words starting with '@'
    const regex = /@(\w+)/g;
    
    // Split the text into an array of words
    const words = text.split(/\s+/);
    
    // Iterate through the words and apply styles to words starting with '@'
    const formattedText = words.map((word, index) => {
      if (word.match(regex)) {
        return <span key={index} style={{ color: 'grey' }}>{word}</span>;
      } else {
        return <span key={index}>{word}</span>;
      }
    });
  
    return formattedText;
  }

  export default blogcomment;