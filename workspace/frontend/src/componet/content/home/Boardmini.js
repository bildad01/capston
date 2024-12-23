import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Boardmini.module.css';

export default function Boardmini() {
    const [boardPosts, setBoardPosts] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://127.0.0.1:5000/board/list')
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setError('게시글 데이터를 불러오는 데 실패했습니다.');
                } else {
                    // created_at을 기준으로 내림차순 정렬
                    const sortedData = data.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
                    setBoardPosts(sortedData.slice(0, 5)); // 최신 5개만 설정
                }
            })
            .catch(() => setError('게시글 데이터를 불러오는 데 실패했습니다.'));
    }, []);

    if (error) return <p className={styles.error}>{error}</p>;

    const handleButtonClick = () => {
        navigate('/board'); // Board.js로 이동
    };

    return (
        <div className={styles.boardMiniContainer}>
            <h3 className={styles.h3}>
                자유게시판
                <button onClick={handleButtonClick} className={styles.boardButton}>
                    ➕
                </button>
            </h3>

            <ul className={styles.boardList}>
                {boardPosts.map((post) => (
                    <li key={post._id} className={styles.boardItem}>
                        <Link to={`/board/${post._id}`} className={styles.boardLink}>
                            {post.board_title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
