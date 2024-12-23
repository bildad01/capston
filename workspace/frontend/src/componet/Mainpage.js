import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import styles from './Mainpage.module.css'
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';
import Home from './content/Home';
import Contest from './content/Contest';
import ContestDetail from './content/ContestDetail';
import Activity from './content/Activity';
import ActivityDetail from './content/ActivityDetail';
import Recommend from './content/Recommend';
import Board from './content/Board';
import Write from './content/board/Write';
import BoardDetail from './content/board/BoardDetail';
import MyCalendar from './content/home/MyCalendar';
import Slider from './content/home/Slider';
import Boardmini from './content/home/Boardmini';
import Login from './content/home/Login';
import Join from './content/home/Join';
import PostDetail from './content/PostDetail';
import PostList from './content/PostList';


export default function Mainpage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  const handleLoginStatusChange = (status) => {
    setIsLoggedIn(status);  // 로그인 성공 시 상태 변경
  };
  return (
    <Router>
        <div className={styles.container}>
        <Header isLoggedIn={isLoggedIn} onLoginStatusChange={handleLoginStatusChange} />
            <Navigation />
            <div className={styles.content_wrapper}>
                <main className={styles.main_content}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/Contest" element={<Contest />} />
                        <Route path="/posts" element={<PostList />} />
                        <Route path="/post/:id" element={<PostDetail />} />
                        <Route path="/contest/:id" element={<ContestDetail />} />
                        <Route path="/contest/detail/:id" element={<ContestDetail />} /> {/* 상세 페이지 경로 설정 */}
                        <Route path="/Activity" element={<Activity />} />
                        <Route path="/eeca/:id" element={<ActivityDetail isLoggedIn={isLoggedIn}/>} />
                        <Route path="/Board" element={<Board isLoggedIn={isLoggedIn}/>} />
                        <Route path="/recommend/:contestId" element={<Recommend />} />
                        <Route path="/MyCalendar" element={<MyCalendar />}/>
                        <Route path="/Write" element={<Write />}/>
                        <Route path="/Slider" element={<Slider />}/>                        
                        <Route path="/Boardmini" element={<Boardmini />} /> 
                        <Route path="/board/:postId" element={<BoardDetail />} />
                        <Route path="/Login" element={<Login onLoginSuccess={handleLoginStatusChange} />} />
                        <Route path="/Join" element={<Join />} />
                        
                    </Routes>
                </main>
            </div>
            <Footer />
        </div>
    </Router>
  )
}
