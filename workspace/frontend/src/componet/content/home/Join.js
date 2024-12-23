import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Join.module.css';

function Join() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();

    const userData = {
      user_id: userId,
      password,
      department,
      name,
      age,
      gender,
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTimeout(() => navigate('/login'), 1000);
      } else {
        setErrorMessage(data.error || '회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      setErrorMessage('서버와 연결할 수 없습니다.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.loginTitle}>회원가입</h1>
      <form onSubmit={handleJoin} className={styles.loginForm}>
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
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className={styles.loginInput}
        >
          <option value="">학부를 선택해주세요</option>
            <option value="기독교학부">기독교학부</option>
            <option value="어문학부">어문학부</option>
            <option value="사회복지학부">사회복지학부</option>
            <option value="경찰학부">경찰학부</option>
            <option value="경상학부">경상학부</option>
            <option value="관광학부">관광학부</option>
            <option value="사범학부">사범학부</option>
            <option value="컴퓨터공학부">컴퓨터공학부</option>
            <option value="보건학부">보건학부</option>
            <option value="간호학과">간호학과</option>
            <option value="디자인영상학부">디자인영상학부</option>
            <option value="스포츠과학부">스포츠과학부</option>
            <option value="문화예술학부">문화예술학부</option>
            <option value="혁신융합학부">혁신융합학부</option>
            <option value="첨단IT학부">첨단IT학부</option>
            <option value="외식산업학부">외식산업학부</option>
        </select>
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.loginInput}
        />
        <input
          type="text"
          placeholder="나이"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className={styles.loginInput}
        />
        <div className={styles.genderGroup}>
          <label htmlFor="male">
            <input
              type="radio"
              id="male"
              name="gender"
              value="male"
              checked={gender === 'male'}
              onChange={() => setGender('male')}
            />
            남성
          </label>
          <label htmlFor="female">
            <input
              type="radio"
              id="female"
              name="gender"
              value="female"
              checked={gender === 'female'}
              onChange={() => setGender('female')}
            />
            여성
          </label>
        </div>
        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
        <button type="submit" className={styles.loginButton}>회원가입</button>
      </form>
      <p className={styles.joinLink} onClick={() => navigate('/')}>뒤로가기</p>
    </div>
  );
}

export default Join;
