import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import logo from '../../src/image/logo.png';

export default function Header({ isLoggedIn, onLoginStatusChange }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLoginStatusChange(false);
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <a href="https://www.bu.ac.kr/web/index.do">
        <img src={logo} alt="학교 로고" className={styles.logo} />
      </a>
      <h1 className={styles.title}>빅데이터 기반 공모전 추천 웹사이트</h1>


    </header>
  );
}
