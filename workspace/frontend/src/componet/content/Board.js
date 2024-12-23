import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Board.module.css';

export default function Board() {
    // 게시글 데이터를 관리하는 상태들
    const [boardPosts, setBoardPosts] = useState([]);  // 전체 게시글 목록
    const [filteredPosts, setFilteredPosts] = useState([]);  // 필터링된 게시글 목록
    const [error, setError] = useState(null);  // 오류 메시지 상태
    const [selectedCategory, setSelectedCategory] = useState('all');  // 선택된 카테고리 상태
    const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지 상태
    const [postsPerPage] = useState(15);  // 한 페이지당 보여줄 게시글 수
    const navigate = useNavigate();  // 페이지 이동을 위한 navigate 함수

    // 페이지 로드 시 게시글 데이터를 가져오는 useEffect 훅
    useEffect(() => {
        fetch('http://127.0.0.1:5000/board/list')  // 게시글 API 요청
            .then((response) => response.json())  // JSON 형태로 변환
            .then((data) => {
                console.log(data);
                if (data.error) {  // API에서 에러가 발생하면
                    setError('게시글 데이터를 불러오는 데 실패했습니다.');
                } else {
                    // 게시물 생성일을 기준으로 내림차순 정렬
                    const sortedPosts = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    setBoardPosts(sortedPosts);  // 전체 게시글 목록에 저장
                    setFilteredPosts(sortedPosts);  // 필터링된 게시글 목록에 저장
                }
            })
            .catch(() => setError('게시글 데이터를 불러오는 데 실패했습니다.'));  // 네트워크 오류 처리
    }, []);

    // 카테고리 변경 시 필터링된 게시글 목록을 업데이트하는 useEffect 훅
    useEffect(() => {
        if (selectedCategory === 'all') {
            setFilteredPosts(boardPosts);  // 모든 게시글을 보여줌
        } else {
            // 선택된 카테고리에 맞는 게시글 필터링
            const filtered = boardPosts.filter((post) => {
                if (selectedCategory === 'contest') {
                    return post.contest_title;  // 공모전 게시글만 필터링
                } else if (selectedCategory === 'eeca') {
                    return post.eeca_title;  // 비교과 게시글만 필터링
                } else {
                    return !post.contest_title && !post.eeca_title;  // 공모전과 비교과가 모두 없는 게시글
                }
            });
            setFilteredPosts(filtered);  // 필터링된 게시글 목록 업데이트
        }
    }, [selectedCategory, boardPosts]);

    // 오류가 있을 경우 오류 메시지를 출력
    if (error) return <p className={styles.error}>{error}</p>;

    // 글쓰기 버튼 클릭 시 'write' 페이지로 이동
    const handleWriteButtonClick = () => {
        navigate('/write');
    };

    // 게시글 클릭 시 해당 게시글 페이지로 이동
    const handlePostClick = (postId) => {
        navigate(`/board/${postId}`);
    };

    // 게시글의 카테고리를 반환하는 함수
    const getPostCategory = (post) => {
        if (post.contest_title && post.eeca_title) {
            return '공모전/비교과';
        }
        if (post.contest_title) {
            return '공모전';
        }
        if (post.eeca_title) {
            return '비교과';
        }
        return '없음';
    };

    // 현재 페이지에 해당하는 게시글 목록을 계산
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    // 페이지 번호 클릭 시 현재 페이지를 업데이트하는 함수
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    return (
        <div className={styles.boardContainer}>
            <h2>게시글 목록</h2>

            {/* 필터링 및 글쓰기 버튼 섹션 */}
            <div className={styles.filterAndButtonContainer}>
                <div className={styles.categoryFilter}>
                    <label>분류 선택:</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="all">전체</option>
                        <option value="contest">공모전</option>
                        <option value="eeca">비교과</option>
                        <option value="none">없음</option>
                    </select>
                </div>
                <button onClick={handleWriteButtonClick} className={styles.writeButton}>
                    글쓰기
                </button>
            </div>

            {/* 게시글 목록 테이블 */}
            <div className={styles.boardLayout}>
                <div className={styles.tableOfContents}>
                    <table>
                        <thead>
                            <tr>
                                <th>분류</th>
                                <th>제목</th>
                                <th>작성자</th>
                                <th>작성일</th>
                                <th>조회수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* 게시글이 없으면 '게시글이 없습니다' 메시지 출력 */}
                            {currentPosts.length === 0 ? (
                                <tr><td colSpan="5">게시글이 없습니다.</td></tr>
                            ) : (
                                currentPosts.map((post) => (
                                    <tr key={post._id} onClick={() => handlePostClick(post._id)}>
                                        <td>{getPostCategory(post)}</td>
                                        <td className={styles.boardTitle}>
                                            {/* 제목이 24자 이상이면 생략 처리 */}
                                            {post.board_title.length > 24 ? post.board_title.slice(0, 24) + '...' : post.board_title}
                                        </td>
                                        <td>{post.name}</td>
                                        <td>{new Date(post.created_at).toLocaleDateString()}</td>
                                        <td>{post.views || 0}</td> {/* 조회수 출력 */}
                                    </tr>   
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 페이지네이션 버튼 */}
            <div className={styles.pagination}>
                <button 
                    onClick={() => paginate(currentPage - 1)} 
                    disabled={currentPage === 1}  // 첫 페이지에서 '이전' 버튼 비활성화
                    className={styles.paginationButton}
                >
                    &lt;
                </button>
                {[...Array(totalPages).keys()].map((pageNumber) => (
                    <button
                        key={pageNumber + 1}
                        onClick={() => paginate(pageNumber + 1)}
                        className={`${styles.paginationButton} ${currentPage === pageNumber + 1 ? styles.activePage : ''}`}  // 현재 페이지에 스타일 추가
                    >
                        {pageNumber + 1}
                    </button>
                ))}
                <button 
                    onClick={() => paginate(currentPage + 1)} 
                    disabled={currentPage === totalPages}  // 마지막 페이지에서 '다음' 버튼 비활성화
                    className={styles.paginationButton}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
}
