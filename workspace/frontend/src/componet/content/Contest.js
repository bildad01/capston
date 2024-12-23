import React, { useEffect, useState } from 'react';
import ImageGrid from './ImageGrid';
import CategoryBar from './CategoryBar';

export default function Contest() {
  // 상태 관리
  const [data, setData] = useState([]); // 대회 데이터를 저장
  const [selectedCategory, setSelectedCategory] = useState('All'); // 선택된 카테고리
  const [selectedTarget, setSelectedTarget] = useState('All'); // 선택된 대상
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [error, setError] = useState(null); // 오류 상태
  const [sortOption, setSortOption] = useState('latest'); // 정렬 기준
  const [loading, setLoading] = useState(true); // 로딩 상태
  const imagesPerPage = 16; // 한 페이지당 이미지 갯수

  // 데이터 불러오기
  useEffect(() => {
    setLoading(true); // 데이터 로딩 시작
    fetch('http://127.0.0.1:5000/contest/list') // 서버에서 데이터 불러오기
      .then((response) => response.json())
      .then((data) => {
        setData(data); // 데이터 상태 업데이트
        setLoading(false); // 데이터 로딩 끝
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('데이터를 불러오는 데 실패했습니다.'); // 에러 처리
        setLoading(false); // 로딩 종료
      });
  }, []);

  // 카테고리와 대상 옵션 만들기 (중복 제거)
  const categories = [
    ...new Set(data.flatMap((contest) => (Array.isArray(contest.category) ? contest.category : [contest.category])))
  ];

  const targets = [
    ...new Set(data.flatMap((contest) => (Array.isArray(contest.target) ? contest.target : [contest.target])))
  ];

  // 필터링된 이미지 리스트
  const sortedFilteredImages = () => {
    let filtered = selectedCategory === 'All' && selectedTarget === 'All'
      ? data // 선택된 카테고리와 대상이 'All'일 경우 모든 데이터
      : data.filter((contest) => {
          // 카테고리와 대상 필터링
          const categoryMatch =
            selectedCategory === 'All' ||
            (Array.isArray(contest.category) ? contest.category.includes(selectedCategory) : contest.category === selectedCategory);
          const targetMatch =
            selectedTarget === 'All' ||
            (Array.isArray(contest.target) ? contest.target.includes(selectedTarget) : contest.target === selectedTarget);

          return categoryMatch && targetMatch;
        });

    // 정렬 기준에 맞춰 데이터 정렬
    if (sortOption === 'latest') {
      filtered = filtered.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));  // start_date 기준 오름차순
    } else if (sortOption === 'deadline') {
      filtered = filtered.filter((contest) => {
        const deadline = new Date(contest.end_date);
        return deadline > new Date();  // 마감 임박은 현재 시간보다 이후의 데이터만 표시
      }).sort((a, b) => new Date(a.end_date) - new Date(b.end_date));  // end_date 기준 오름차순으로 변경
    } else if (sortOption === 'expired') {
      filtered = filtered.filter((contest) => {
        const deadline = new Date(contest.end_date);
        return deadline <= new Date();  // 마감된 데이터만 표시
      });
    }

    return filtered; // 필터링된 데이터 반환
  };

  // 현재 페이지에 맞는 이미지 리스트
  const imagesToDisplay = sortedFilteredImages();

  // 페이지네이션을 위한 시작과 끝 인덱스
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = imagesToDisplay.slice(indexOfFirstImage, indexOfLastImage);

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(imagesToDisplay.length / imagesPerPage);

  // 마감일 계산 함수
  const getDeadline = (endDate) => {
    const now = new Date();
    const deadline = new Date(Date.parse(endDate));
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? `D-${diffDays}` : '마감'; // 마감일을 D-날짜 형식으로 표시
  };

  return (
    <div className="App" style={{ display: 'flex' }}>
      {/* 카테고리 바 컴포넌트 */}
      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        targets={targets}
        selectedTarget={selectedTarget}
        setSelectedTarget={setSelectedTarget}
      />
      <div style={{ flex: 1, paddingLeft: '20px' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {selectedCategory === 'All' ? '전체' : `${selectedCategory}`}
          <div style={{ marginLeft: 'auto', marginTop: '0' }}>
            {/* 정렬 옵션 선택 */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{
                marginLeft: '10px',  // select와 텍스트 사이에 간격 추가
                padding: '5px 10px',
                fontSize: '14px',
              }}
            >
              <option value="latest">최신 등록순</option>
              <option value="deadline">마감 임박</option>
              <option value="expired">마감</option>
            </select>
          </div>
        </h1>
        {/* 오류 메시지 출력 */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {/* 로딩 중 메시지 출력 */}
        {loading && <p>로딩 중...</p>} 

        {/* 이미지 그리드 컴포넌트 */}
        <ImageGrid
          images={currentImages.map((contest) => ({
            img_url: contest.img_url,
            title: contest.title,
            category: Array.isArray(contest.category) ? contest.category.join(', ') : contest.category,
            target: Array.isArray(contest.target) ? contest.target.join(', ') : contest.target,
            deadline: getDeadline(contest.end_date),
            contest_id: contest._id
          }))}
        />

        {/* 페이지네이션 */}
        <div className="pagination">
          {/* 이전 페이지 버튼 */}
          <span
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            style={{
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              padding: '0 5px',
              opacity: currentPage === 1 ? 0.5 : 1
            }}
          >
            &lt;
          </span>
          {/* 페이지 번호 버튼 */}
          {[...Array(totalPages)].map((_, index) => (
            <span
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              style={{
                cursor: 'pointer',
                padding: '0 5px',
                fontWeight: currentPage === index + 1 ? 'bold' : 'normal'
              }}
            >
              {index + 1}
            </span>
          ))}
          {/* 다음 페이지 버튼 */}
          <span
            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            style={{
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              padding: '0 5px',
              opacity: currentPage === totalPages ? 0.5 : 1
            }}
          >
            &gt;
          </span>
        </div>
      </div>
    </div>
  );
}
