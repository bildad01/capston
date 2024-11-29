// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';  // 'react-dom/client'에서 'createRoot' 사용
import App from './App';  // App.js에서 컴포넌트 불러오기
import './index.css';
import reportWebVitals from './reportWebVitals';

// React 18에서 새로운 방식으로 앱을 렌더링
const root = ReactDOM.createRoot(document.getElementById('root'));  // 'root' DOM 요소를 찾고
root.render(
  <React.StrictMode>
    <App />  {/* App 컴포넌트 실행 */}
  </React.StrictMode>
);

// 성능 측정을 원할 경우, reportWebVitals로 기록할 수 있습니다.
reportWebVitals();
