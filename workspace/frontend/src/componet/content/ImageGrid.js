import React from 'react';
import { Link } from 'react-router-dom';  // Link 임포트
import styles from './ImageGrid.module.css';

function ImageGrid({ images }) {
    return (
        <div className={styles.image_grid}>
            {images.map((image, index) => (
                <div key={index} className={styles.image_container}>
                    {/* 조건에 따라 Link 경로를 다르게 설정 */}
                    <Link to={image.contest_id ? `/contest/${image.contest_id}` : `/eeca/${image.eeca_id}`}>
                        <img
                            src={image.img_url}
                            alt={image.title}
                            className={styles.image_item}
                        />
                        <div className={styles.overlay}>
                            <div className={styles.dday}>{image.deadline}</div>
                            <div className={styles.title}>{image.title}</div>
                            <div className={styles.category}>{image.category}</div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}

export default ImageGrid;
