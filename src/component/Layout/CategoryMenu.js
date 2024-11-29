// components/CategoryMenu.js

import React from 'react';
import { Link } from 'react-router-dom'; // Link 컴포넌트 import
import './CategoryMenu.css';

function CategoryMenu() {
  return (
    <div className="category-menu">
      <h3>분야별 카테고리</h3>
      <ul>
          <li><Link to="/Frame">전체</Link></li>
          <li><a href="-">기획/아이디어</a></li>
          <li><a href="-">광고/마케팅</a></li>
          <li><a href="-">논문/리포트</a></li>
          <li><a href="-">영상/UCC/사진</a></li>
          <li><a href="-">디자인/캐릭터/웹툰</a></li>
          <li><a href="-">웹/모바일/IT</a></li>
          <li><a href="-">게임/소프트웨어</a></li>
          <li><a href="-">과학/공학</a></li>
          <li><a href="-">문학/글/시나리오</a></li>
          <li><a href="-">건축/건설/인테리어</a></li>
          <li><a href="-">네이밍/슬로건</a></li>
          <li><a href="-">예체능/미술/음악</a></li>
          <li><a href="-">대외활동/서포터즈</a></li>
          <li><a href="-">봉사활동</a></li>
          <li><a href="-">취업/창업</a></li>
          <li><a href="-">해외</a></li>
          <li><a href="-">기타</a></li>

      </ul>
    </div>
  );
}

export default CategoryMenu;