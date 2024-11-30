import React from 'react';
import './ImageGrid.css';

const ImageGrid = ({ images }) => {
  return (
    <div className="image-grid">
      {images.map((image, index) => (
        <div key={index} className="image-container">
          <img src={image.img_url} alt={image.title} className="slider-image" />
          <div className="image-overlay">
            <div className="dday">{image.deadline}</div>
            <div className="title">{image.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
