import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './Slider.module.css'
//import mImage from './mainpage.png'


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
    if (images.length === 0) {
      setCurrentIndex(0);
      return;
    }
    stopAutoSlide();
    intervalRef.current = setInterval(nextImage, 5000);
  }, [nextImage, images.length]);

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
        setCurrentIndex(0);
      }, 700);
    }
  }, [currentIndex, images.length]);

  const calculateDday = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `D${diffDays >= 0 ? `-${diffDays}` : `+${Math.abs(diffDays)}`}`;
  };

  return (
    <div className={styles.slider_container} onMouseEnter={stopAutoSlide} onMouseLeave={startAutoSlide}>
      <div className={styles.pagination}>
        {images.slice(0, 3).map((_, index) => (  // 버튼 개수를 3개로 제한
          <button
            key={index}
            className={`${styles.pagination_button} ${index === currentIndex ? styles.active : ''}`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>
      <div
        className={styles.slider}
        style={{
          transform: `translateX(-${currentIndex * 33.33}%)`, // 3개의 이미지를 나란히 표시
        }}
      >
        {images.map((image, index) => {
          const dday = calculateDday(competitions[index]?.end_date); // 디데이 계산
          const title = competitions[index]?.title;
          const category = competitions[index]?.category;

          return (
            <div className={styles.slide} key={index}>
              <div className={styles.image_container}>
                <img src={image} alt={titles[index]} className={styles.slider_image} />
                <div className={styles.image_overlay}>
                  <div className={styles.dday}>{dday}</div>
                  <div className={styles.title}>{title}</div>
                  <div className={styles.category}>{category}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default function Slider() {
  const [contests, setContests] = useState([]);
  const [eecas, setEecas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/contest/list')
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data
          .sort((a, b) => b.views - a.views)
          .slice(0, 7);
          setContests(sortedData);
      })
      .catch(() => setError('공모전 데이터를 불러오는 데 실패했습니다.'));

    fetch('http://127.0.0.1:5000/eeca/list')
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data
          .sort((a, b) => b.views - a.views)
          .slice(0, 7);
          setEecas(sortedData);
      })
      .catch(() => setError('비교과 프로그램 데이터를 불러오는 데 실패했습니다.'));
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const contestImages = contests.map((contest) => contest.img_url);
  const contestTitles = contests.map((contest) => contest.title);
  const eecaImages = eecas.map((eeca) => eeca.img_url);
  const eecaTitles = eecas.map((eeca) => eeca.title);


  return (
    <div className={styles.content_section}>
      <div className={styles.section}>
        <h2>공모전/대외활동</h2>
        <InfiniteLoopSlider images={contestImages} titles={contestTitles} competitions={contests} />
      </div>
      <div className={styles.section}>
        <h2>비교과 프로그램</h2>
        <InfiniteLoopSlider images={eecaImages} titles={eecaTitles} competitions={eecas} />
      </div>
    </div>
  );
}