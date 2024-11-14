import React from 'react';
import './Main.css';
import Header from './component/Layout/Header';
import Navigation from './component/Layout/Navigation';
import Footer from './component/Layout/Footer';
import CategoryMenu from './component/Layout/CategoryMenu';
import ContentSection from './component/ContentSection';



export default function Main() {
    return (
    <div className="container">
      <Header />
      <Navigation />
      <div className="content-wrapper"> {/* content-wrapper로 감싸서 정렬 */}
        <aside>
          <CategoryMenu />
        </aside>
        <main className="main-content">
          <ContentSection />
        </main>
      </div>
      <Footer />
    </div>
    );
}
