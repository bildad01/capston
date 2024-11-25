import React, { useState } from 'react';
import './Addpost.css';

function Add_post() {
  const [title, setTitle] = useState(''); // 제목 상태
  const [link, setLink] = useState('');  // 링크 상태
  const [content, setContent] = useState(''); // 내용 상태

  const handleTitleChange = (e) => {
    setTitle(e.target.value); // 제목 상태 업데이트
  };

  const handleLinkChange = (e) => {
    setLink(e.target.value); // 링크 상태 업데이트
  };

  const handleContentChange = (e) => {
    setContent(e.target.value); // 내용 상태 업데이트
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 작성 완료 후 처리 (예: 서버에 데이터 전송)
    console.log('글 제목:', title);
    console.log('공모전 링크:', link);
    console.log('글 내용:', content);
    
    // 필드 초기화
    setTitle('');
    setLink('');
    setContent('');
  };

  return (
    <div className="App">
      <h1>글 작성 페이지</h1>
      <form onSubmit={handleSubmit}>
        {/* 제목 입력 필드 */}
        <div>
          <label htmlFor="title">제목:</label>
          <input
            type="text" 
            id="title" 
            value={title} 
            onChange={handleTitleChange} 
            placeholder="글 제목을 입력하세요" 
            required 
          />
        </div>

        {/* 공모전 링크 입력 필드 */}
        <div>
          <label htmlFor="link">공모전 링크:</label>
          <input
            type="text" 
            id="link" 
            value={link} // 링크 상태와 연결
            onChange={handleLinkChange} // 링크 상태 업데이트 핸들러
            placeholder="공모전 링크를 입력하세요" 
            required 
          />
        </div>

        {/* 글 내용 입력 필드 */}
        <div>
          <label htmlFor="content">내용:</label>
          <textarea
            id="content" 
            value={content} 
            onChange={handleContentChange} 
            placeholder="글 내용을 입력하세요" 
            rows="5" 
            required 
          />
        </div>

        {/* 제출 버튼 */}
        <button type="submit">글 작성 완료</button>
      </form>
    </div>
  );
}

export default Add_post;
