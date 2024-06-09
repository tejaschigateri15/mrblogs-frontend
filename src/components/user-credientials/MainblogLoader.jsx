import React from 'react';
import styled, { keyframes } from 'styled-components';

const skeletonAnimation = keyframes`
  0% {
    background-color: #F3F4F6;
    background-image: linear-gradient(90deg, #F3F4F6, #E5E7EB, #F3F4F6);
    background-size: 200% 100%;
    background-position: 0% 50%;
  }
  50% {
    background-color: #F3F4F6;
    background-image: linear-gradient(90deg, #F3F4F6, #E5E7EB, #F3F4F6);
    background-size: 200% 100%;
    background-position: 100% 50%;
  }
  100% {
    background-color: #F3F4F6;
    background-image: linear-gradient(90deg, #F3F4F6, #E5E7EB, #F3F4F6);
    background-size: 200% 100%;
    background-position: 0% 50%;
  }
`;

const SkeletonLoader = styled.div`
  width: 802px;
  height: 215px;
  border-radius: 25px;
  background-color: #F3F4F6;
  animation: ${skeletonAnimation} 3s infinite;
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export default function MainblogLoader() {
  return (
    <LoaderContainer>
      <SkeletonLoader />
      <SkeletonLoader />
      <SkeletonLoader />
      <SkeletonLoader />
    </LoaderContainer>
  );
}