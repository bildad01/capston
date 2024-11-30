import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './ContentSection.css';

import 비교과1 from '../image/비교과1.jpg';
import 비교과2 from '../image/비교과2.jpg';
import 비교과3 from '../image/비교과3.jpg';
import 비교과4 from '../image/비교과4.jpg';
import 비교과5 from '../image/비교과5.jpg';

const InfiniteLoopSlider = ({ images, titles, competitions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const startAutoSlide = useCallback(() => {
    stopAutoSlide();
    intervalRef.current = setInterval(nextImage, 5000);
  }, [nextImage]);

  const stopAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [startAutoSlide]);

  useEffect(() => {
    if (currentIndex === images.length - 1) {
      setTimeout(() => {
        setCurrentIndex(0); // 마지막 슬라이드에서 처음으로 돌아가게 설정
      }, 700); // 애니메이션 시간에 맞춰 이동
    }
  }, [currentIndex, images.length]);

  const calculateDday = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 밀리초를 일 단위로 변환
    return `D${diffDays >= 0 ? `-${diffDays}` : `+${Math.abs(diffDays)}`}`;
  };

  return (
    <div className="slider-container" onMouseEnter={stopAutoSlide} onMouseLeave={startAutoSlide}>
      <div
        className="slider"
        style={{
          transform: `translateX(-${currentIndex * 33.33}%)`, // 3개의 이미지를 나란히 표시
        }}
      >
        {images.map((image, index) => {
          const dday = calculateDday(competitions[index]?.end_date); // 디데이 계산
          const title = competitions[index]?.title;
          const category = competitions[index]?.category;
          
          return (
            <div className="slide" key={index}>
              <div className="image-container">
                <img src={image} alt={titles[index]} className="slider-image" />
                <div className="image-overlay">
                  <div className="dday">{dday}</div>
                  <div className="title">{title}</div>
                  <div className="category">{category}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="pagination">
        {images.slice(0, 3).map((_, index) => (  // 버튼 개수를 3개로 제한
          <button
            key={index}
            className={`pagination-button ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

function ContentSection() {
  const [competitions, setCompetitions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/data')
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data
          .sort((a, b) => parseInt(b.views.replace(',', '')) - parseInt(a.views.replace(',', '')))
          .slice(0, 5);
        setCompetitions(sortedData);
      })
      .catch(() => setError('데이터를 불러오는 데 실패했습니다.'));
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const images = competitions.map((contest) => contest.img_url);
  const titles = competitions.map((contest) => contest.title);

  return (
    <div className="content-section">
      <div className="section">
        <h2>공모전/대외활동</h2>
        <InfiniteLoopSlider images={images} titles={titles} competitions={competitions} />
      </div>
      <div className="section">
        <h2>비교과 프로그램</h2>
        <InfiniteLoopSlider
          images={[비교과1, 비교과2, 비교과3, 비교과4, 비교과5]}
          titles={['비교과 1', '비교과 2', '비교과 3', '비교과 4', '비교과 5']}
          competitions={[
            { end_date: '2024-12-10', title: '비교과 1', category: 'Category 1' },
            { end_date: '2024-12-15', title: '비교과 2', category: 'Category 2' },
            { end_date: '2024-12-20', title: '비교과 3', category: 'Category 3' },
            { end_date: '2024-12-25', title: '비교과 4', category: 'Category 4' },
            { end_date: '2024-12-30', title: '비교과 5', category: 'Category 5' }
          ]}
        />
      </div>
      <div className="button-container">
        <button className="action-button">팀원 찾기</button>
        <Link to="/Addpost" className="action-button">
          글 작성하기
        </Link>
      </div>
    </div>
  );
}

export default ContentSection;
