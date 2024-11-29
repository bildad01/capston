// ImageGrid.js
import React from 'react';
import './ImageGrid.css'; // Make sure to import the CSS file for styling

function ImageGrid({ images }) {
  return (
    <div className="image-grid">
      {images.map((image, index) => (
        <div key={index} className="image-container">
          <img
            src={image.img_url}
            alt={image.title}
            className="image-item"
          />
          <div className="overlay">
            <p className="title">{image.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ImageGrid;
