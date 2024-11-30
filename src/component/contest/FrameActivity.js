import React, { useEffect, useState } from 'react';
import ImageGrid from './ImageGrid';

function FrameActivity() {
  const [data, setData] = useState([]); // 데이터 상태 추가
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null); // 에러 상태 추가
  const imagesPerPage = 16;

  useEffect(() => {
    // 백엔드에서 데이터 받아오기
    fetch('http://127.0.0.1:5000/data')
      .then((response) => response.json())
      .then((data) => setData(data)) // 데이터를 state로 설정
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('데이터를 불러오는 데 실패했습니다.');
      });
  }, []);

  // 가져올 카테고리 리스트
  const includedCategories = ['대외활동/서포터즈', '취업/창업', '봉사활동'];

  // 카테고리 추출 및 중복 제거, 포함할 카테고리 필터링
  const categories = [
    ...new Set(data.flatMap((contest) => contest.category || [])) // 중첩 배열 처리
  ].filter(category => includedCategories.includes(category));

  // 선택한 분야의 이미지 필터링
  const filteredImages =
    selectedCategory === 'All'
      ? data.filter((contest) => {
          // 'All' 선택 시, 3가지 카테고리가 포함된 데이터만 필터링
          return contest.category.some(category => includedCategories.includes(category));
        })
      : data.filter((contest) =>
          contest.category.includes(selectedCategory)
        );

  // 현재 페이지에 해당하는 이미지 슬라이싱
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = filteredImages.slice(indexOfFirstImage, indexOfLastImage);

  // 페이지 번호 계산
  const totalPages = Math.ceil(filteredImages.length / imagesPerPage);

  // 페이지 전환 함수
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 페이지 번호를 보여주는 부분
  const paginate = () => {
    const visiblePages = 3;
    let start = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
    let end = Math.min(start + visiblePages - 1, totalPages);

    if (end - start < visiblePages - 1) {
      start = Math.max(end - visiblePages + 1, 1);
    }

    const pageLinks = [];
    if (start > 1) pageLinks.push('...');
    for (let i = start; i <= end; i++) {
      pageLinks.push(i);
    }
    if (end < totalPages) pageLinks.push('...');

    return pageLinks.map((page, index) => (
      <span
        key={index}
        onClick={() => page !== '...' && setCurrentPage(page)}
        style={{
          cursor: page === '...' ? 'default' : 'pointer',
          padding: '0 5px',
          fontWeight: page === currentPage ? 'bold' : 'normal',
        }}
      >
        {page}
      </span>
    ));
  };

  // 마감기한을 계산하는 함수
  const getDeadline = (endDate) => {
    const now = new Date();
    const deadline = new Date(endDate);
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? `D-${diffDays}` : '마감';
  };

  return (
    <div className="App">
      <h1>전체 공모전</h1>

      {/* 에러 메시지 표시 */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* 분야 선택 버튼 */}
      <div className="category-selection">
        <button onClick={() => setSelectedCategory('All')}>전체</button>
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(category)}
            style={{
              fontWeight: selectedCategory === category ? 'bold' : 'normal',
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <ImageGrid
        images={currentImages.map((contest) => ({
          img_url: contest.img_url,
          title: contest.title, // Ensure you have the title available
          category: contest.category.join(', '), // 카테고리 리스트를 문자열로 변환
          deadline: getDeadline(contest.end_date), // 마감기한 표시
        }))}
      />

      {/* 페이지네이션 */}
      <div className="pagination">
        <span
          onClick={prevPage}
          style={{
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            padding: '0 5px',
            opacity: currentPage === 1 ? 0.5 : 1,
          }}
        >
          &lt; {/* "<" 기호 */}
        </span>

        {paginate()}

        <span
          onClick={nextPage}
          style={{
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            padding: '0 5px',
            opacity: currentPage === totalPages ? 0.5 : 1,
          }}
        >
          &gt; {/* ">" 기호 */}
        </span>
      </div>
    </div>
  );
}

export default FrameActivity;
