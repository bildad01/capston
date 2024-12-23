import React, { useEffect, useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom'; 
import styles from './ContestDetail.module.css'; 

// ActivityDetail 컴포넌트는 공모전 상세 정보를 렌더링하는 역할
export default function ActivityDetail() {
  const { id } = useParams(); // URL에서 공모전 ID를 가져옴
  const [contest, setContest] = useState(null); // 공모전 데이터를 저장
  const [error, setError] = useState(null); // 에러 메시지를 저장
  const [userId, setUserId] = useState(null); // 사용자 ID 상태 관리
  const [isLiked, setIsLiked] = useState(false); // 좋아요 상태 관리
  const [isScrapped, setIsScrapped] = useState(false); // 스크랩 상태 관리

  const navigate = useNavigate(); // 페이지 이동을 위한 hook 사용

  // 공모전 데이터를 서버에서 가져오는 useEffect
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/eeca/detail/${id}`) // API 호출
      .then((response) => response.json()) // JSON으로 변환
      .then((data) => setContest(data)) // 데이터를 상태에 저장
      .catch((error) => { // 에러 발생 시 처리
        console.error('Error fetching contest data:', error);
        setError('상세 정보를 불러오는 데 실패했습니다.');
      });
  }, [id]); // id가 변경될 때마다 실행

  // 날짜 형식을 YYYY-MM-DD로 변환하는 함수
  const formatDate = (date) => {
    if (!date) return "No date"; // 날짜가 없으면 기본값 반환
    const formattedDate = date.split('T')[0]; // 시간 부분 제거
    return formattedDate;
  };

  // 남은 날짜를 계산하는 함수
  const calculateDday = (endDate) => {
    if (!endDate) return null; // 종료일이 없으면 null 반환
    const now = new Date(); // 현재 날짜
    const deadline = new Date(Date.parse(endDate)); // 종료일
    const diffTime = deadline - now; // 시간 차이 계산
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 남은 일수 계산
    return diffDays;
  };

  // 좋아요 또는 스크랩 상호작용 처리 함수
  const handleInteraction = (type) => {
    if (!userId) { // 로그인하지 않은 경우 경고 메시지
      alert('로그인이 필요합니다.');
      navigate('/'); // 로그인 페이지로 이동
      return;
    }

    // 상호작용 데이터 서버 전송
    fetch('http://127.0.0.1:5000/eeca/interact', {
      method: 'POST', // POST 요청
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId, // 사용자 ID
        item_id: contest._id, // 공모전 ID
        type: type, // 상호작용 타입 (like or scrap)
        timestamp: new Date().toISOString(), // 현재 시간
      }),
    })
      .then((response) => {
        if (!response.ok) { // 응답이 실패하면 에러 처리
          throw new Error('상호작용 데이터를 전송하는 데 실패했습니다.');
        }
        return response.json();
      })
      .then((data) => {
        alert(`"${type === 'like' ? '좋아요' : '스크랩'}"를 완료했습니다!`);
        // 상태 업데이트
        if (type === 'like') {
          setIsLiked(!isLiked);
        } else {
          setIsScrapped(!isScrapped);
        }
      })
      .catch((error) => {
        console.error('상호작용 전송 실패:', error);
        alert('상호작용 전송에 실패했습니다.');
      });
  };

  // 뒤로 가기 버튼 클릭 처리 함수
  const handleBackClick = () => {
    window.history.back(); // 이전 페이지로 이동
  };

  // 현재 페이지 링크를 복사하는 함수
  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(window.location.href) // 현재 URL 복사
      .then(() => {
        alert('링크가 클립보드에 복사되었습니다!');
      })
      .catch((error) => {
        console.error('링크 복사 실패:', error);
      });
  };

  // 임시 버튼 클릭 이벤트 처리 함수
  const handleButtonClick = () => {
    alert('버튼 클릭됨');
  };

  // 데이터 로드 중 에러 발생 시 메시지 출력
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  // 로딩 상태 처리
  if (!contest) return <p>Loading...</p>;

  const dday = calculateDday(contest.end_date); // D-Day 계산

  // 공모전 상세 정보 렌더링
  return (
    <div className={styles['contest-detail']}>
      <div className={styles['header']}>
        <h1 className={styles.h1}>
          {contest.title || "No title"}{" "}
          {dday !== null && (
            <span
              className={
                dday < 0
                  ? styles['dday-past'] // 마감 상태 스타일
                  : dday <= 10
                  ? styles['dday-warning'] // 10일 이내 경고 스타일
                  : styles['dday-normal'] // 일반 상태 스타일
              }
            >
              {dday < 0 ? " [마감]" : `D-${dday}`} // D-Day 표시
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
    </div>
  );
}
