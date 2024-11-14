import React from 'react';
import ImageGrid from './components/computer/ImageGrid';

function Cse() {
  // 네모난 박스로 대체할 이미지들
  const images = [
    'https://via.placeholder.com/150', 
    'https://via.placeholder.com/150', 
    'https://via.placeholder.com/150', 
    'https://via.placeholder.com/150',
    'https://via.placeholder.com/150', 
    'https://via.placeholder.com/150', 
    'https://via.placeholder.com/150', 
    'https://via.placeholder.com/150',
    'https://via.placeholder.com/150', 
    'https://via.placeholder.com/150', 
    'https://via.placeholder.com/150', 
    'https://via.placeholder.com/150',
    'https://via.placeholder.com/150', 
    'https://via.placeholder.com/150', 
    'https://via.placeholder.com/150', 
    'https://via.placeholder.com/150'
  ];

  return (
    <div className="App">
      <h1>웹 크롤링 이미지 4x4 그리드</h1>
      <ImageGrid images={images} />
    </div>
  );
}

export default Cse;
