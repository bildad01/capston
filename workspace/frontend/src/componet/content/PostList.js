import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 임포트
import styles from "./PostList.module.css"; // CSS 모듈 임포트

function PostList() {
  const [post, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(15); // 페이지당 게시글 수
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수

  useEffect(() => {
    // 게시글 데이터 가져오기
    fetch("http://127.0.0.1:5000/post/list", {
      method: "GET",
      credentials: "include", // 인증 정보 포함 (CORS 설정)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // category 기준으로 내림차순 정렬
        const sortedData = data.sort((a, b) => {
          if (a.category > b.category) return -1;
          if (a.category < b.category) return 1;
          return 0;
        });
        setPosts(sortedData);
        setFilteredPosts(sortedData);
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);
  
  

  // 카테고리 선택 시 게시글 필터링
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredPosts(post);
    } else {
      const filtered = post.filter((post) => post.category === selectedCategory);
      setFilteredPosts(filtered);
    }
  }, [selectedCategory, post]);

  const handlePostClick = (id) => {
    // 클릭한 게시글의 _id로 PostDetail 페이지로 이동
    navigate(`/post/${id}`);
  };

  // 페이지네이션 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>공모전 TIP</h1>

      {/* 게시글 목록 테이블 */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>분류</th>
            <th>제목</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts
            .map((post, index) => {
              const descendingOrderNumber =
                filteredPosts.length - indexOfFirstPost - index; // 내림차순 순번 계산
              return (
                <tr
                  key={post._id}
                  onClick={() => handlePostClick(post._id)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{descendingOrderNumber}</td> {/* 내림차순 순번 표시 */}
                  <td>{post.title}</td>
                </tr>
              );
            })}
        </tbody>

      </table>

      {/* 페이지네이션 버튼 */}
      <div className={styles.pagination}>
        {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? styles.activePage : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PostList;
