import React, { useState } from 'react';
import ImageGrid from './ImageGrid';

function Frame() {
  // 네모난 박스로 대체할 이미지들
  const images = [
    'https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150',
    'https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150',
    'https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150',
    'https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150',
    // 이미지가 더 많으면 페이지가 넘어가게 됩니다.
    'https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150',
    'https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150',
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 16;

  // 현재 페이지에 해당하는 이미지 슬라이싱
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);

  // 페이지 번호 계산
  const pageNumbers = [];
  const totalPages = Math.ceil(images.length / imagesPerPage);
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

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

  // 페이지 번호를 보여주는 부분 (ex: < 1 2 3 ... >)
  const paginate = () => {
    const visiblePages = 3; // 한 번에 보여줄 페이지 번호의 개수
    let start = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
    let end = Math.min(start + visiblePages - 1, totalPages);

    if (end - start < visiblePages - 1) {
      start = Math.max(end - visiblePages + 1, 1);
    }

    const pageLinks = [];
    if (start > 1) pageLinks.push('...');  // 첫 페이지보다 앞에 있는 페이지가 있을 경우 "..." 표시

    for (let i = start; i <= end; i++) {
      pageLinks.push(i);
    }

    if (end < totalPages) pageLinks.push('...');  // 마지막 페이지보다 뒤에 있는 페이지가 있을 경우 "..." 표시

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

  return (
    <div className="App">
      <h1>이건 전체 페이지인데 어떻게 분야를 나눠서 보여주지?</h1>
      <ImageGrid images={currentImages} />

      <div className="pagination">
        <span 
          onClick={prevPage} 
          style={{ cursor: currentPage === 1 ? 'default' : 'pointer', padding: '0 5px' }}
          disabled={currentPage === 1}
        >
          &lt;  {/* "<" 기호 */}
        </span>

        {paginate()}

        <span 
          onClick={nextPage} 
          style={{ cursor: currentPage === totalPages ? 'default' : 'pointer', padding: '0 5px' }}
          disabled={currentPage === totalPages}
        >
          &gt;  {/* ">" 기호 */}
        </span>
      </div>
    </div>
  );
}

export default Frame;
