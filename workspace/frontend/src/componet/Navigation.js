import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navigation.module.css'

export default function Navigation() {
  return (
    <nav className={styles.navigation}>
      <ul>
        <li><Link to="/Contest">공모전/대외활동</Link></li>
        <li><Link to="/Activity">비교과</Link></li>
        <li><Link to="/">홈</Link></li>
        <li><Link to="/Board">게시판</Link></li>
        <li><Link to="/Posts">공모전 자료 </Link></li>
      </ul>
    </nav>
  );
}
