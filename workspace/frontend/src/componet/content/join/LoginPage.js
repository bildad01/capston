import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const BoardJoin = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch('/session/check', { method: 'GET' });
      const result = await response.json();
      if (response.ok && result.logged_in) {
        setLoggedIn(true);
        setUser(result.user);
      } else {
        setLoggedIn(false);
        history.push('/login');
      }
    };
    checkSession();
  }, [history]);

  if (!loggedIn) {
    return <p>로그인 후 이용 가능합니다.</p>;
  }

  return (
    <div>
      <h1>게시판</h1>
      <p>환영합니다, {user.name}님! {user.department} 소속입니다.</p>
      {/* 게시판 내용 */}
    </div>
  );
};

export default BoardJoin;
