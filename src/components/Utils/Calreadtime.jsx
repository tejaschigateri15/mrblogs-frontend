const calculatereadtime = (blogbody) => {
  if (!blogbody) {
      return 0; // or any default value you prefer
  }
  const wordCount = blogbody.split(/\s+/).length;
  const averageReadingSpeed = 250;
  const estimatedReadingTime = Math.ceil(wordCount / averageReadingSpeed);
  return estimatedReadingTime;
};

export default calculatereadtime;
