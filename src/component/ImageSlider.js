import React, { useState } from 'react';
import './ImageSlider.css'; // CSS 파일을 import

const ImageSlider = () => {
  const images = ['1.jpg', '2.jpg', '3.jpg']; // 이미지 파일 배열 (여기서 4개 이상의 이미지도 가능)
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 이미지 인덱스

  // 다음 이미지로 이동하는 함수
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // 이전 이미지로 이동하는 함수
  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // 이미지 이동을 위한 스타일을 반환
  const getSliderStyle = () => {
    return {
      transform: `translateX(-${(currentIndex * 33.33)}%)`, // 3개씩 이미지가 이동하도록 설정
      transition: 'transform 0.5s ease', // 부드러운 전환 효과
    };
  };

  return (
    <div className="slider-container">
      <button className="prev" onClick={prevImage}> &lt; </button>
      
      <div className="slider" style={getSliderStyle()}>
        {images.map((image, index) => (
          <img key={index} src={image} alt={`Image ${index + 1}`} className="slider-image" />
        ))}
      </div>
      
      <button className="next" onClick={nextImage}> &gt; </button>
    </div>
  );
};

export default ImageSlider;
