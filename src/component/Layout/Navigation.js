import React from 'react';
import './Navigation.css';  // CSS 파일을 import

function Navigation() {
  return (
    <nav id="navigation">
      <ul>
        <li><a href="writing.html">글쓰기</a></li>
        <li><a href="competitions.html">공모전</a></li>
        <li><a href="main.html">홈</a></li>
        <li><a href="create-team.html">팀 만들기</a></li>
        <li><a href="recommend.html">추천</a></li>
      </ul>
    </nav>
  );
}

export default Navigation;
