import React from 'react';
import './Header.css';  // CSS 파일을 import
import logoImage from '../../image/logo_1.png';  // 상대 경로 수정

export default function Header() {
  return (
    <header id="header">
      <a href="https://www.bu.ac.kr/web/index.do" id="logo">
        <img src={logoImage} alt="학교 로고" id="logo-image" />
      </a>

      <h1 id="site-name">"수상한 멘토</h1>

      <button id="login" onClick={() => alert('로그인 기능 구현 예정')}>
        로그인
      </button>
    </header>
  );
}
