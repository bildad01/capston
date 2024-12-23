import React from 'react';
import MyCalendar from './home/MyCalendar';  // MyCalendar 컴포넌트
import Slider from './home/Slider';          // Slider 컴포넌트
import Boardmini from './home/Boardmini';
import styles from './Home.module.css';       // CSS 모듈
import Login from './home/Login';
import image12 from './12.png';       // 이미지 임포트 (경로는 적절하게 수정)

export default function Home() {
  return (
    <section className={styles.home}>
      <div className={styles.container}>
        {/* 상단 전체 영역 */}
        <div className={styles.top_section}>
          <div className={styles.imageContainer}>
            <img src={image12} alt="Image" className={styles.image12} />
          </div>
          <Login /> {/* 오른쪽 영역에 Login 컴포넌트 */}
        </div>

        {/* 하단 두 개의 나뉜 영역 */}
        <div className={styles.bottom_section}>
          <div className={styles.left_section}>
            <Slider /> {/* Slider 컴포넌트 */}
          </div>
          <div className={styles.right_section}>
            <Boardmini /> {/* MyCalendar 안에 Boardmini 삽입 */}
            <MyCalendar />
          </div>
        </div>
      </div>
    </section>
  );
}
