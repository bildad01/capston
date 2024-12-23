import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './BoardDetail.module.css';

export default function BoardDetail() {
    const { postId } = useParams();
    const [postDetails, setPostDetails] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
    const navigate = useNavigate();

    // 날짜 포맷 함수 (년.월.일 형식)
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    // 게시글 상세 정보 가져오기
    useEffect(() => {
        // 게시글 상세 정보 가져오기
        fetch(`http://127.0.0.1:5000/board/detail/${postId}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setError('게시글 상세 정보를 불러오는 데 실패했습니다.');
                } else {
                    setPostDetails(data);
                }
            })
            .catch(() => setError('게시글 상세 정보를 불러오는 데 실패했습니다.'))
            .finally(() => setIsLoading(false)); // 로딩 상태 종료

    }, [postId]);

    if (isLoading) return <p>로딩 중...</p>; // 로딩 중일 때 메시지 표시
    if (error) return <p className={styles.error}>{error}</p>; // 오류 메시지 표시
    if (!postDetails) return <p>게시글을 불러올 수 없습니다.</p>; // 데이터가 없을 때 메시지 표시

    const handleGoBack = () => navigate(-1);

    // 공모전, 비교과 활동 링크 처리
    const handleNavigate = (id, type) => {
        const url = type === 'contest' ? `/contest/${id}` : `/eeca/${id}`;
        navigate(url);
    };

    return (
        <div className={styles.boardDetailContainer}>
            <header className={styles.headerContainer}>
                <h2 className={styles.boardTitle}>{postDetails.board_title}</h2>
                <div className={styles.metadata}>
                    <span className={styles.writer}>작성자: {postDetails.name}</span>
                    <span className={styles.date}>작성일: {formatDate(postDetails.created_at)}</span>
                </div>
            </header>

            {/* 공모전 정보 */}
            {postDetails.contest_title && (
                <div
                    className={styles.contestContainer}
                    onClick={() => handleNavigate(postDetails.contest_id, 'contest')}
                >
                    <div className={styles.contestTitle}>
                        <strong>공모전:</strong> {postDetails.contest_title}
                    </div>
                    {postDetails.contest_image && (
                        <img
                            src={postDetails.contest_image}
                            alt="공모전 이미지"
                            className={styles.contestImage}
                        />
                    )}
                </div>
            )}

            {/* 비교과 정보 */}
            {postDetails.eeca_title && (
                <div
                    className={styles.eecaContainer}
                    onClick={() => handleNavigate(postDetails.eeca_id, 'eeca')}
                >
                    <div className={styles.eecaTitle}>
                        <strong>비교과:</strong> {postDetails.eeca_title}
                    </div>
                    {postDetails.eeca_image && (
                        <img
                            src={postDetails.eeca_image}
                            alt="비교과 이미지"
                            className={styles.eecaImage}
                        />
                    )}
                </div>
            )}


            <div className={styles.boardPostContainer}>
                <p className={styles.boardPost}>{postDetails.board_post}</p>
            </div>

            <button onClick={handleGoBack} className={styles.goBackButton}>뒤로가기</button>
        </div>
    );
}
