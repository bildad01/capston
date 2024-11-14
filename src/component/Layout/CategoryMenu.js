// components/CategoryMenu.js

import React from 'react';
import './CategoryMenu.css';

function CategoryMenu() {
  return (
    <div className="category-menu">
      <h3>분야별 카테고리</h3>
      <ul>
        <li><a href="ㅗ">컴퓨터 공학</a></li>
        <li><a href="https://www.bu.ac.kr/web/index.do">정보통신학</a></li>
        <li><a href="https://www.bu.ac.kr/web/index.do">경영학</a></li>
        <li><a href="https://www.bu.ac.kr/web/index.do">사회복지학</a></li>
        <li><a href="https://www.bu.ac.kr/web/index.do">디지털미디어학</a></li>
        <li><a href="https://www.bu.ac.kr/web/index.do">영어영문학</a></li>
        <li><a href="https://www.bu.ac.kr/web/index.do">법학</a></li>
        <li><a href="https://www.bu.ac.kr/web/index.do">의료관리학</a></li>
      </ul>
    </div>
  );
}

export default CategoryMenu;
