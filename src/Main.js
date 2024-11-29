// Main.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './Main.css';
import Header from './component/layout/Header';
import Navigation from './component/layout/Navigation';
import Footer from './component/layout/Footer';
import CategoryMenu from './component/layout/CategoryMenu';
import ContentSection from './component/ContentSection';
import Frame from './component/basicframe/Frame';
import Addpost from './component/message/Addpost';

// import Competitions from './component/Competitions'; // 예시 컴포넌트 추가

export default function Main({data}) {
  return (
    <Router> {/* Router로 전체를 감쌉니다 */}
      <div className="container">
        <Header />
        <Navigation />
        <div className="content-wrapper"> {/* content-wrapper로 감싸서 정렬 */}
          <aside>
            <CategoryMenu />
          </aside>
          <main className="main-content">
            {/* Routes 추가: ContentSection을 기본값으로, 다른 경로는 동적으로 */}
            <Routes>
              <Route path="/" element={<ContentSection />} />
              <Route path="/Frame" element={<Frame />} />
              <Route path="/Addpost" element={<Addpost />} />
            
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
