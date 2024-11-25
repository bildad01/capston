import React, { useState, useRef, useEffect } from 'react'; // useState, useRef, useEffect를 import
import { Link } from 'react-router-dom'; // React Router의 Link 컴포넌트 추가
import './ContentSection.css'; // CSS 파일을 import

// 이미지 import
import 비교과1 from '../image/비교과1.jpg';
import 비교과2 from '../image/비교과2.jpg';
import 비교과3 from '../image/비교과3.jpg';
import 비교과4 from '../image/비교과4.jpg';
import 비교과5 from '../image/비교과5.jpg';

const ImageSlider = ({ images, titles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const [imageWidth, setImageWidth] = useState(0);

  const updateImageWidth = () => {
    if (sliderRef.current) {
      const firstImage = sliderRef.current.querySelector('.slider-image');
      if (firstImage) {
        setImageWidth(firstImage.clientWidth);
      }
    }
  };

  useEffect(() => {
    updateImageWidth();
    window.addEventListener('resize', updateImageWidth);

    return () => {
      window.removeEventListener('resize', updateImageWidth);
    };
  }, []);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const getSliderStyle = () => {
    return {
      transform: `translateX(-${currentIndex * imageWidth}px)`,
      transition: 'transform 0.5s ease',
    };
  };

  return (
    <div className="slider-container" ref={sliderRef}>
      <div className="slider" style={getSliderStyle()}>
        {images.map((image, index) => (
          <div className="image-wrapper" key={index}>
            <img src={image} alt={titles[index]} className="slider-image" />
            <div className="image-text">{titles[index]}</div>
          </div>
        ))}
      </div>

      <button className="prev" onClick={prevImage}>&lt;</button>
      <button className="next" onClick={nextImage}>&gt;</button>
    </div>
  );
};

function ContentSection() {
  return (
    <div className="content-section">
      <div className="section">
        <h2>공모전 HOT</h2>
        <ImageSlider
          images={[
            "/images/competition_placeholder1.png",
            "/images/competition_placeholder2.png",
            "/images/competition_placeholder3.png"
          ]}
          titles={["공모전 1", "공모전 2", "공모전 3"]}
        />
      </div>

      <div className="section">
        <h2>비교과 프로그램</h2>
        <ImageSlider
          images={[비교과1, 비교과2, 비교과3, 비교과4, 비교과5]}
          titles={["비교과 1", "비교과 2", "비교과 3", "비교과 4", "비교과 5"]}
        />
      </div>

      {/* 버튼 컨테이너 */}
      <div className="button-container">
        <button className="action-button">팀원 찾기</button>
        {/* 글 작성하기 버튼 */}
        <Link to="/Addpost" className="action-button">글 작성하기</Link>
      </div>
    </div>
  );
}

export default ContentSection;
