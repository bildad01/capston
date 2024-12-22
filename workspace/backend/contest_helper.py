import requests
from bs4 import BeautifulSoup
import pymongo

# MongoDB URI 설정
myclient = pymongo.MongoClient("mongodb+srv://alswl3:cgwu3fo7eHzEmcf8@minjik.sotgr.mongodb.net/capston")
db = myclient["capston"]  # 데이터베이스 선택
collection = db["contest_helper"]  # 컬렉션 선택

# 사이트 URL 템플릿
url_template = "https://www.wevity.com/?c=comm&s=1&bbsid=comm1&gp=1&gbn=viewok&ix={}"

# 크롤링할 페이지 번호 범위
start_idx = 2613
end_idx = 2632

# 데이터를 저장할 리스트
data = []

# 페이지마다 크롤링
for idx in range(start_idx, end_idx + 1):
    url = url_template.format(idx)
    response = requests.get(url)
    
    # 응답이 성공적인지 확인
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 타이틀 추출
        title = soup.find('div', class_='standard-view-title')
        title = title.get_text(strip=True) if title else "No title"
        
        # 콘텐츠 추출
        content = soup.find('div', class_='standard-view-content')
        content_text = content.get_text("\n", strip=True) if content else "No content"
        
        # MongoDB에 저장할 데이터 준비
        entry = {
            'id': idx,
            'title': title,
            'content': content_text
        }
        
        # MongoDB에 데이터 삽입
        collection.insert_one(entry)
        print(f"Inserted data for ID: {idx}")
        
    else:
        print(f"Failed to retrieve page {idx}")

print("Data insertion complete.")
