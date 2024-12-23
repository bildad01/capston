import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";  // useNavigate로 변경
import styles from './PostDetail.module.css'; // CSS 모듈 import

function PostDetail() {
  const { id } = useParams(); // URL 파라미터에서 id 가져오기
  const [post, setPost] = useState(null);
  const navigate = useNavigate(); // useNavigate로 변경

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/post/detail/${id}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setPost(data))
      .catch((error) => console.error("Error fetching post:", error));
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  const contentWithLineBreaks = post.content
    .split('.')
    .map((sentence, index) => (
      <p key={index}>{sentence.trim()}{index < post.content.split('.').length - 1 ? '.' : ''}</p>
    ));

  const handleBackClick = () => {
    navigate(-1); // 뒤로 가기 기능
  };

  return (
    <div className={styles['post-detail-container']}>
      <div className={styles['back-button-container']}>
        <button className={styles['back-button']} onClick={handleBackClick}>❌</button>
      </div>
      <h1 className={styles['post-title']}>{post.title}</h1>
      <div className={styles['post-content']}>
        {contentWithLineBreaks}
      </div>
    </div>
  );
}

export default PostDetail;
