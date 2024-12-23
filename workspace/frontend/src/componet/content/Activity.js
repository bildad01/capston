import React, { useEffect, useState } from 'react';
import ImageGrid from './ImageGrid';
import CategoryBar from './CategoryBar';

export default function Activity() {
  // State 관리
  const [data, setData] = useState([]); // 공모전 데이터를 저장
  const [selectedCategory, setSelectedCategory] = useState('All'); // 선택된 카테고리 상태
  const [selectedTarget, setSelectedTarget] = useState('All'); // 선택된 대상 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [error, setError] = useState(null); // 에러 메시지 상태
  const [sortOption, setSortOption] = useState('latest'); // 정렬 옵션 상태
  const imagesPerPage = 16; // 한 페이지당 표시할 이미지 수

  // 데이터 Fetch
  useEffect(() => {
    fetch('http://127.0.0.1:5000/eeca/list')
      .then((response) => response.json())
      .then((data) => setData(data)) // 서버에서 가져온 데이터를 상태로 저장
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('데이터를 불러오는 데 실패했습니다.'); // 에러 발생 시 메시지 설정
      });
  }, []);

  // 데이터에서 카테고리와 대상을 추출하여 유니크하게 만듦
  const categories = [
    ...new Set(data.flatMap((contest) => (Array.isArray(contest.category) ? contest.category : [contest.category])))
  ];
  const targets = [
    ...new Set(data.flatMap((contest) => (Array.isArray(contest.target) ? contest.target : [contest.target])))
  ];

  // 정렬 및 필터링된 데이터 반환 함수
  const sortedFilteredImages = () => {
    // 선택된 카테고리와 대상에 따라 데이터 필터링
    let filtered = selectedCategory === 'All' && selectedTarget === 'All'
      ? data
      : data.filter((contest) => {
          const categoryMatch =
            selectedCategory === 'All' ||
            (Array.isArray(contest.category) ? contest.category.includes(selectedCategory) : contest.category === selectedCategory);
          const targetMatch =
            selectedTarget === 'All' ||
            (Array.isArray(contest.target) ? contest.target.includes(selectedTarget) : contest.target === selectedTarget);
          return categoryMatch && targetMatch;
        });

    // 정렬 옵션에 따라 데이터 정렬
    if (sortOption === 'latest') {
      filtered = filtered.sort((a, b) => new Date(a.start_date) - new Date(b.start_date)); // 최신 등록순
    } else if (sortOption === 'deadline') {
      filtered = filtered.filter((contest) => {
        const deadline = new Date(contest.end_date);
        return deadline > new Date(); // 현재 시점 이후의 데이터만 표시
      }).sort((a, b) => new Date(a.end_date) - new Date(b.end_date)); // 마감일 기준 오름차순
    } else if (sortOption === 'expired') {
      filtered = filtered.filter((contest) => {
        const deadline = new Date(contest.end_date);
        return deadline <= new Date(); // 마감된 데이터만 표시
      });
    }

    return filtered;
  };

  const imagesToDisplay = sortedFilteredImages(); // 필터링 및 정렬된 데이터
  const indexOfLastImage = currentPage * imagesPerPage; // 현재 페이지의 마지막 이미지 인덱스
  const indexOfFirstImage = indexOfLastImage - imagesPerPage; // 현재 페이지의 첫 이미지 인덱스
  const currentImages = imagesToDisplay.slice(indexOfFirstImage, indexOfLastImage); // 현재 페이지의 이미지들

  const totalPages = Math.ceil(imagesToDisplay.length / imagesPerPage); // 전체 페이지 수 계산

  // 마감일 표시 형식 설정 함수
  const getDeadline = (endDate) => {
    const now = new Date();
    const deadline = new Date(Date.parse(endDate));
    const diffTime = deadline - now; // 현재 시점과 마감일의 차이
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 일수로 변환
    return diffDays >= 0 ? `D-${diffDays}` : '마감'; // D-Day 형식
  };

  return (
    <div className="App" style={{ display: 'flex' }}>
      {/* 카테고리 및 대상 필터 */}
      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        targets={targets}
        selectedTarget={selectedTarget}
        setSelectedTarget={setSelectedTarget}
      />
      <div style={{ flex: 1, paddingLeft: '20px' }}>
        {/* 헤더 */}
        <h1
          style={{
            fontSize: '30px',
            fontWeight: 'bold',
            marginBottom: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {selectedCategory === 'All' ? '전체' : `${selectedCategory}`}
          <div style={{ marginLeft: 'auto', marginTop: '0' }}>
            {/* 정렬 옵션 선택 */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{
                marginLeft: '10px',
                padding: '5px 10px',
                fontSize: '14px'
              }}
            >
              <option value="latest">최신 등록순</option>
              <option value="deadline">마감 임박</option>
              <option value="expired">마감</option>
            </select>
          </div>
        </h1>
        {/* 에러 메시지 */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {/* 이미지 그리드 */}
        <ImageGrid
          images={currentImages.map((contest) => ({
            img_url: contest.img_url,
            title: contest.title,
            category: Array.isArray(contest.category) ? contest.category.join(', ') : contest.category,
            target: Array.isArray(contest.target) ? contest.target.join(', ') : contest.target,
            deadline: getDeadline(contest.end_date),
            eeca_id: contest._id // ID 값 설정
          }))}
        />
        {/* 페이지네이션 */}
        <div className="pagination">
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
