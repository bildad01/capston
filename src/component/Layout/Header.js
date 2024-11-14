import React from 'react';
import './Header.css';  // CSS 파일을 import

export default function Header() {
  return (
    <header id="header">
      {/* 버튼으로 대체된 학교 로고, 클릭 시 링크로 이동 */}
      <a href="https://www.bu.ac.kr/web/index.do" id="logo">
        <button id="logo-button">
          학교 로고
        </button>
      </a>

      <h1 id="site-name">[웹사이트 이름]</h1>

      <button id="login" onClick={() => alert('로그인 기능 구현 예정')}>
        로그인
      </button>
    </header>
  );
}
