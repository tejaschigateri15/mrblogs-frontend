import Skeleton from '@mui/material/Skeleton';
import { Box } from '@mui/material';
import {deepPurple,blue,pink,indigo,cyan,blueGrey} from '@mui/material/colors';
import '../css/skeletonloader.css'


export default function Test2() {

  return (
    <div className='text_loader'>

      <Box sx={{ width: 300 }}>
      <Skeleton width="860px" height={60} sx={{ bgcolor: blueGrey[100] }} className='text_loaderxx' />
      <Skeleton width="860px" height={60} sx={{ bgcolor: blueGrey[100] }} className='text_loaderxx' />
      <Skeleton width="860px" height={60} sx={{ bgcolor: blueGrey[100] }} className='text_loaderxx' />
      <Skeleton width="860px" height={60} sx={{ bgcolor: blueGrey[100] }} className='text_loaderxx' />
      <Skeleton width="860px" height={60} sx={{ bgcolor: blueGrey[100] }} className='text_loaderxx' />
      <Skeleton width="860px" height={60} sx={{ bgcolor: blueGrey[100] }} className='text_loaderxx' />
        

        {/* <Skeleton animation="wave" /> */}
        {/* <Skeleton variant="circular" width={40} height={40}  animation="wave"/> */}
        {/* <Skeleton animation={false} /> */}
      </Box>
      {/* <TextGenerateEffect words={words} />; */}
      {/* <img src="google-gemini-icon.png" alt="" width="55px" height="55px" /> */}
    </div>
  )
}
