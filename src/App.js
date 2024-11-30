// App.js
import React, { useState, useEffect } from 'react';
import Main from './Main';

function App() {
  const [data, setData] = useState([]);
  

  useEffect(() => {
    fetch('http://localhost:5000/data')
      .then((response) => response.json())
      .then((data) => {
        console.log('Received data:', data);  // 데이터 확인을 위한 로그
        setData(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    
    <div>
      <Main data={data} /> {/* data를 Main 컴포넌트로 전달 */}
    </div>
  );
}

export default App;
