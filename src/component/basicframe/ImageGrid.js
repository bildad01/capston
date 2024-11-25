import React from 'react';
import './ImageGrid.css';

const ImageGrid = ({ images }) => {
  return (
    <div className="image-grid">
      {images.map((image, index) => (
        <div key={index} className="image-box">
          <img src={image} alt={`Slide ${index + 1}`} className="grid-image" />
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
