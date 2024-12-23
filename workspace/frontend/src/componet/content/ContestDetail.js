import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Recommend from './Recommend'; // Recommend 컴포넌트 임포트
import styles from './ContestDetail.module.css';

export default function ContestDetai() {
  const { id } = useParams(); // URL 파라미터에서 id 추출
  const [contest, setContest] = useState(null); // 공모전 데이터를 저장할 상태
  const [error, setError] = useState(null); // 에러 메시지를 저장할 상태
  const [userId, setUserId] = useState(null); // 사용자 아이디 상태
  const [isLiked, setIsLiked] = useState(false); // 좋아요 상태
  const [isScrapped, setIsScrapped] = useState(false); // 스크랩 상태
  
  const navigate = useNavigate();  // 페이지 이동을 위한 navigate 함수

  // 컴포넌트가 마운트되거나 id가 변경될 때마다 공모전 데이터를 불러오는 useEffect
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/contest/detail/${id}`)
      .then((response) => response.json())
      .then((data) => setContest(data)) // 공모전 데이터를 상태에 저장
      .catch((error) => {
        console.error('Error fetching contest data:', error);
        setError('상세 정보를 불러오는 데 실패했습니다.'); // 에러 발생 시 에러 메시지 설정
      });
  }, [id]); // id가 변경될 때마다 다시 실행

  // 날짜 형식을 YYYY-MM-DD로 변환하는 함수
  const formatDate = (date) => {
    if (!date) return "No date"; // 날짜가 없으면 "No date" 반환
    const formattedDate = date.split('T')[0]; // 'T'를 기준으로 날짜만 추출
    return formattedDate;
  };

  // D-day 계산 함수
  const calculateDday = (endDate) => {
    if (!endDate) return null; // 종료 날짜가 없으면 null 반환
    const now = new Date(); // 현재 시간
    const deadline = new Date(Date.parse(endDate)); // 종료 날짜
    const diffTime = deadline - now; // 남은 시간 계산
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 남은 일수 계산
    return diffDays;
  };

  // 좋아요 및 스크랩 기능을 처리하는 함수
  const handleInteraction = (type) => {
    if (!userId) { // 로그인된 사용자가 없으면 로그인 페이지로 이동
      alert('로그인이 필요합니다.');
      navigate('/');
      return;
    }

    fetch('http://127.0.0.1:5000/eeca/interact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        item_id: contest._id,
        type: type,
        timestamp: new Date().toISOString(),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('상호작용 데이터를 전송하는 데 실패했습니다.');
        }
        return response.json();
      })
      .then((data) => {
        alert(`"${type === 'like' ? '좋아요' : '스크랩'}"를 완료했습니다!`);
        if (type === 'like') {
          setIsLiked(!isLiked); // 좋아요 상태 토글
        } else {
          setIsScrapped(!isScrapped); // 스크랩 상태 토글
        }
      })
      .catch((error) => {
        console.error('상호작용 전송 실패:', error);
        alert('상호작용 전송에 실패했습니다.');
      });
  };

  // 뒤로 가기 버튼 클릭 시 페이지를 이전 페이지로 되돌리는 함수
  const handleBackClick = () => {
    window.history.back();
  };

  // 현재 페이지의 URL을 클립보드에 복사하는 함수
  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        alert('링크가 클립보드에 복사되었습니다!');
      })
      .catch((error) => {
        console.error('링크 복사 실패:', error);
      });
  };

  // 버튼 클릭 시 경고 메시지를 표시하는 함수
  const handleButtonClick = () => {
    alert('버튼 클릭됨');
  };

  // 공모전 설명을 '■', '-', '*', '※' 기호를 기준으로 나누어 렌더링하는 함수
  const renderDescription = (description) => {
    if (!description) return null;

    // '■' 기호를 기준으로 텍스트를 분리
    const parts = description.split(/■|\-|\*|\※/).map((part, index) => (
      <p key={index}>{part.trim()}</p>
    ));
    

    return parts;
  };

  // 에러가 있을 경우 에러 메시지 표시
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!contest) return <p>Loading...</p>; // 공모전 데이터가 로딩 중일 때 표시

  const dday = calculateDday(contest.end_date); // D-day 계산

  return (
    <div className={styles['contest-detail']}>
      <div className={styles['header']}>
        <h1 className={styles.h1}>
          {contest.title || "No title"}{" "}
          {dday !== null && (
            <span
              className={
                dday < 0
                  ? styles['dday-past'] // 마감된 경우
                  : dday <= 10
                  ? styles['dday-warning'] // 10일 이하로 남은 경우
                  : styles['dday-normal'] // 그 외
              }
            >
              {dday < 0 ? " [마감]" : `D-${dday}`}
            </span>
          )}
        </h1>
        <button className={styles['back-button']} onClick={handleBackClick}>
          ✕
        </button>
      </div>

      <div className={styles['detail-container']}>
        <div className={styles['image-container']}>
          <img src={contest.img_url || "No image URL"} alt="Contest" />
        </div>
        <div className={styles['info-container']}>
          <div className={styles['info-row']}>
            <strong>분야</strong>
            <span>{contest.category ? contest.category.join('   ❙   ') : "No category"}</span>
          </div>
          <div className={styles['info-row']}>
            <strong>대상</strong>
            <span>{contest.target ? contest.target.join('   ❙   ') : "No target"}</span>
          </div>
          <div className={styles['info-row']}>
            <strong>주최</strong>
            <span>{contest.organizer || "No organizer"}</span>
          </div>
          <div className={styles['info-row']}>
            <strong>기간:</strong>
            <span>{`${formatDate(contest.start_date)} ~ ${formatDate(contest.end_date)}`}</span>
          </div>
          <div className={styles['info-row']}>
            <strong>1등 상금</strong>
            <span>{contest.prize || "No prize"}</span>
          </div>
          <div className={styles['info-row']}>
            <strong>홈페이지</strong>
            <a href={contest.homepage || "#"} target="_blank" rel="noopener noreferrer">
              홈페이지
            </a>
          </div>

          {/* 버튼들 */}
          <div className={styles['button-container']}>
            <button
              className={styles['contest-button']}
              onClick={handleButtonClick}
            >
              팀원 구하기
            </button>
            <button className={styles['copy-link-button']} onClick={handleCopyLink}>
              🔗
            </button>
            <button
              className={styles['like-button']}
              onClick={() => handleInteraction('like')}
            >
              {isLiked ? '♥ 좋아요 취소' : '♡ 좋아요'}
            </button>
            <button
              className={styles['scrap-button']}
              onClick={() => handleInteraction('scrap')}
            >
              {isScrapped ? '★ 스크랩 취소' : '☆ 스크랩'}
            </button>
          </div>
        </div>
      </div>

      <Recommend contestId={id} /> {/* 추천 공모전 컴포넌트 */}

      {/* 상세 설명 */}
      <div className={styles['description-container']}>
        <strong>상세 설명</strong>
        <div>{renderDescription(contest.description)}</div>
      </div>

    </div>
  );
}
