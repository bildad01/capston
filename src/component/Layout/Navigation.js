import React from 'react';
import { Link } from 'react-router-dom'; // Link 컴포넌트 import
import './Navigation.css';  // CSS 파일을 import

function Navigation() {
  return (
    <nav id="navigation">
      <ul>
        <li><Link to="/cse">글쓰기</Link></li> {/* Link를 사용하여 경로 설정 */}
        <li><Link to="/competitions">공모전</Link></li>
        <li><Link to="/">홈</Link></li>
        <li><Link to="/create-team">팀 만들기</Link></li>
        <li><Link to="/recommend">추천</Link></li>
      </ul>
    </nav>
  );
}

export default Navigation;
