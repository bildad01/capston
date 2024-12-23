import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Write.module.css';

export default function Write() {
    const [contestOptions, setContestOptions] = useState([]);
    const [eecaOptions, setEecaOptions] = useState([]);
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');  
    const [boardTitle, setBoardTitle] = useState('');
    const [boardPost, setBoardPost] = useState('');
    const [contestId, setContestId] = useState('');
    const [eecaId, setEecaId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // 로컬 스토리지에서 로그인된 사용자 정보를 가져옴
        const sessionData = localStorage.getItem('session');
        if (sessionData) {
            const { user_id, name } = JSON.parse(sessionData);
            setUserName(name);
        } else {
            alert('로그인이 필요합니다');
            navigate('/');  // 로그인 페이지로 리디렉션
        }

        // 공모전 목록 불러오기
        fetch('http://127.0.0.1:5000/contest/list')
            .then(response => response.json())
            .then(data => setContestOptions(data));

        // 비교과 활동 목록 불러오기
        fetch('http://127.0.0.1:5000/eeca/list')
            .then(response => response.json())
            .then(data => setEecaOptions(data));
    }, [navigate]);

    const handleSubmit = (event) => {
        event.preventDefault();

        const postData = {
            name: userName,
            board_title: boardTitle,
            board_post: boardPost,
            contest_id: contestId ? parseInt(contestId) : null,
            eeca_id: eecaId ? parseInt(eecaId) : null,
        };

        fetch('http://127.0.0.1:5000/board/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Response from server:', data);
                if (data.success) {
                    navigate('/board');
                } else {
                    alert('게시글 작성에 실패했습니다: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('서버와의 연결에 문제가 있습니다.');
            });
    };

    return (
        <div className={styles.container}>
            <h2>게시글 작성</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label htmlFor="name">작성자:</label>
                <input
                    type="text"
                    id="name"
                    value={userName}  // 로그인된 사용자의 이름을 자동으로 설정
                    disabled  // 이름을 수정할 수 없게 설정
                />

                <label htmlFor="boardTitle">게시글 제목:</label>
                <input
                    type="text"
                    id="boardTitle"
                    value={boardTitle}
                    onChange={(e) => setBoardTitle(e.target.value)}
                    required
                />

                <label htmlFor="boardPost">게시글 내용:</label>
                <textarea
                    id="boardPost"
                    value={boardPost}
                    onChange={(e) => setBoardPost(e.target.value)}
                    required
                ></textarea>

                <label htmlFor="contestSelect">공모전 선택:</label>
                <select
                    id="contestSelect"
                    value={contestId}
                    onChange={(e) => setContestId(e.target.value)}
                >
                    <option value="">선택하세요</option>
                    {contestOptions.map((contest) => (
                        <option key={contest.contest_id} value={contest.contest_id}>
                            {contest.title}
                        </option>
                    ))}
                </select>

                <label htmlFor="eecaSelect">비교과 활동 선택:</label>
                <select
                    id="eecaSelect"
                    value={eecaId}
                    onChange={(e) => setEecaId(e.target.value)}
                >
                    <option value="">선택하세요</option>
                    {eecaOptions.map((eeca) => (
                        <option key={eeca.eeca_id} value={eeca.eeca_id}>
                            {eeca.title}
                        </option>
                    ))}
                </select>

                <button type="submit" className={styles.submitButton}>
                    게시글 작성
                </button>
            </form>
        </div>
    );
}
