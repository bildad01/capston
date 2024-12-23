import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // 기본 스타일 import
import styles from './MyCalendar.module.css'; // 스타일 파일 import


export default function MyCalendar() {
  const [date, setDate] = useState(new Date()); // 선택된 날짜 상태
  const [contestData, setContestData] = useState([]); // 공모전 정보 저장
  const [selectedContest, setSelectedContest] = useState(null); // 선택된 공모전
  const [error, setError] = useState(null); // 에러 상태
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
  const [isSearchOpen, setIsSearchOpen] = useState(false); // 검색창 열기/닫기 상태
  const searchBoxRef = useRef(null); // 검색창 영역에 대한 참조

  // 공모전 정보 가져오기
  useEffect(() => {
    fetch('http://127.0.0.1:5000/contest/list')
      .then((response) => response.json())
      .then((data) => setContestData(data))
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('데이터를 불러오는 데 실패했습니다.');
      });
  }, []);

  // 날짜가 변경되었을 때 호출되는 함수
  const handleDateChange = (newDate) => {
    setDate(newDate); // 새로운 날짜로 상태 업데이트
  };

  // 공모전 제목 클릭 시 해당 공모전의 날짜 범위 설정
  const handleContestClick = (contest) => {
    setSelectedContest(contest);
  };

  // 검색창 클릭 시 열기
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  // 검색어에 따른 필터링된 공모전 목록
  const filteredContests = contestData.filter((contest) =>
    contest.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 검색창 외부 클릭 시 검색창 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 공모전 기간에 해당하는 날짜에 클래스 적용
  const getTileClassName = ({ date }) => {
    if (selectedContest) {
      const startDate = new Date(selectedContest.start_date);
      const endDate = new Date(selectedContest.end_date);

      if (date >= startDate && date <= endDate) {
        return styles.highlightedDate; // 기간 내 날짜에 스타일 적용
      }
    }

    // 토요일에 파란색 적용
    if (date.getDay() === 6) {
      return styles.saturday; // 토요일에 적용할 스타일
    }

    return null;
  };

  // 엔터 키로 검색 결과 필터링
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsSearchOpen(true); // 엔터 키 누르면 검색창 열기
    }
  };

  return (
    <div className={styles.mycalender}>
      <h2 className={styles.title}>공모전 일정</h2>
  
      {/* 검색창 */}
      <div ref={searchBoxRef} className={styles.searchBox}>
        <input
          type="text"
          placeholder="공모전 제목을 검색하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={toggleSearch}
          onKeyDown={handleKeyDown}
          className={styles.searchInput}
        />
        {isSearchOpen && (
          <div className={styles.searchResults}>
            <ul>
              {filteredContests.length > 0 ? (
                filteredContests.map((contest) => (
                  <li key={contest.id}>
                    <span
                      onClick={() => handleContestClick(contest)}
                      className={styles.contestTitle}
                    >
                      {contest.title}
                    </span>
                  </li>
                ))
              ) : (
                <li>검색 결과가 없습니다.</li>
              )}
            </ul>
          </div>
        )}
      </div>
  
      {/* 선택된 공모전의 기간 표시 */}
      {selectedContest && (
        <div className={styles.selectedContestInfo}>
          <p>
            <strong>{selectedContest.title}</strong>
          </p>
          <p>
            기간: {new Date(selectedContest.start_date).toLocaleDateString()} ~{' '}
            {new Date(selectedContest.end_date).toLocaleDateString()}
          </p>
        </div>
      )}
  
      {/* 캘린더 */}
      <div className={styles.calendarContainer}>
        <Calendar
          onChange={handleDateChange} // 날짜가 변경되면 handleDateChange 함수 실행
          value={date} // 캘린더의 현재 날짜
          tileClassName={getTileClassName} // 기간에 해당하는 날짜에 스타일 추가
          className={styles.calendar} // 스타일 적용
        />
      </div>
  
      <div className={styles.boardContainer}></div>
    </div>
  );
  
}
