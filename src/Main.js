import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './Main.css';
import Header from './component/Layout/Header';
import Navigation from './component/Layout/Navigation';
import Footer from './component/Layout/Footer';
import CategoryMenu from './component/Layout/CategoryMenu';
import ContentSection from './component/ContentSection';
import Cse from './component/computer/Cse'; // 새로 추가된 컴포넌트
// import Competitions from './component/Competitions'; // 예시 컴포넌트 추가

export default function Main() {
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
              <Route path="/cse" element={<Cse />} />
            
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
