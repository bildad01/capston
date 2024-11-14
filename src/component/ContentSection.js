// components/ContentSection.js

import React from 'react';
import Carousel from './ImageSlider';
import './ContentSection.css';  // CSS 파일을 import

function ContentSection() {
  return (
    <div className="content-section">
      <div className="section">
        <h2>공모전 HOT</h2>
        <Carousel images={['competition_placeholder1.png', 'competition_placeholder2.png', 'competition_placeholder3.png', 'competition_placeholder4.png']} />
      </div>

      <div className="section">
        <h2>비교과 프로그램</h2>
        <Carousel images={['extracurricular_placeholder1.png', 'extracurricular_placeholder2.png', 'extracurricular_placeholder3.png', 'extracurricular_placeholder4.png']} />
      </div>
    </div>
  );
}

export default ContentSection;
