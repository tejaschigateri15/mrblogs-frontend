import { Box, Skeleton } from '@mui/material'
import { blueGrey } from '@mui/material/colors'
import React from 'react'

export default function Titleloader() {
  return (
    <div>
        <Box sx={{ width: 300 }}>
             <Skeleton width="860px" height={60} sx={{ bgcolor: blueGrey[100] }} className='text_loaderxx' />
             <Skeleton width="460px" height={60} sx={{ bgcolor: blueGrey[100] }} className='text_loaderxx' />
        </Box>
    </div>
  )
}
