import React, { useState, useEffect } from 'react';
import styles from './Recommend.module.css';
import { useNavigate } from 'react-router-dom'; // useNavigate import

export default function Recommend({ contestId }) {
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // navigate 훅을 사용

  useEffect(() => {
    if (!contestId) return;

    fetch(`http://127.0.0.1:5000/recommend?contest_id=${contestId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('추천 데이터를 불러오는 데 실패했습니다.');
        }
        return response.json();
      })
      .then((data) => setRecommendations(data))
      .catch((error) => {
        console.error('추천 API 오류:', error);
        setError('추천 데이터를 가져오는 데 실패했습니다.');
      });
  }, [contestId]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const handleClick = (id) => {
    // 클릭한 공모전의 ID로 상세 페이지로 이동
    navigate(`/contest/detail/${id}`);
  };

  // 현재 페이지의 공모전은 추천 공모전 리스트에서 3번째 항목에 포함되도록 처리
  const highlightStyle = (index) => {
    // 3번째 항목을 강조하는 클래스
    return index === 2 ? styles['highlight'] : '';
  };

  return (
    <div>
      <h2>추천 공모전</h2>
      <ul className={styles['recommend-list']}>
        {recommendations.map((contest, index) => (
          <li
            key={contest._id}
            className={`${styles['recommend-item']} ${highlightStyle(index)}`}
            onClick={() => handleClick(contest._id)} // 항목 클릭 시 handleClick 함수 호출
          >
            <img src={contest.img_url} alt={contest.title} />
            <p>{contest.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
