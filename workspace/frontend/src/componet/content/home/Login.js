import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';  // CSS 모듈 import

export default function Login({ onLoginSuccess }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  // 페이지 새로고침 시 로그인 상태 확인
  useEffect(() => {
    const sessionData = localStorage.getItem('session');
    if (sessionData) {
      const { user_id, name } = JSON.parse(sessionData);
      setIsLoggedIn(true);
      setUserName(name);
      onLoginSuccess({ isLoggedIn: true, userName: name });
    }
  }, [onLoginSuccess]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, password: password }),
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      setIsLoggedIn(true);
      setUserName(data.session.name);
      // 세션 정보 로컬 스토리지에 저장
      localStorage.setItem('session', JSON.stringify(data.session));
      onLoginSuccess({ isLoggedIn: true, userName: data.session.name });
      navigate('/'); // 로그인 후 홈으로 리디렉션
    } else {
      const errorData = await response.json();
      alert(errorData.error || '로그인 실패');
    }
  };

  const handleLogout = async () => {
    const response = await fetch('http://127.0.0.1:5000/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // 세션을 서버에서 삭제
    });

    if (response.ok) {
      setIsLoggedIn(false);
      setUserName('');
      // 로컬 스토리지에서 세션 정보 삭제
      localStorage.removeItem('session');
      onLoginSuccess({ isLoggedIn: false, userName: '' });
      navigate('/'); // 로그아웃 후 로그인 페이지로 리디렉션
    } else {
      alert('로그아웃 실패');
    }
  };

  return (
    <div className={styles.loginContainer}> 
      <h1 className={styles.loginTitle}>LOGIN</h1>
      {isLoggedIn ? (
        <div>
          <h2 className={styles.welcomeMessage}>
            환영합니다, <span>{userName}</span>님!
          </h2>
          <p className={styles.logoutLink} onClick={handleLogout}>로그아웃</p>
        </div>
      ) : (
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <input
            type="text"
            placeholder="학번"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className={styles.loginInput}  
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.loginInput}  
          />
          <button type="submit" className={styles.loginButton}>로그인</button>
        </form>
      )}
      {!isLoggedIn && (
        <p className={styles.joinLink} onClick={() => navigate('/join')}>회원가입하기</p>
      )}
    </div>
  );
}

// 기본값 설정
Login.defaultProps = {
  onLoginSuccess: () => {},
};
