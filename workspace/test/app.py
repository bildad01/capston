import sys
sys.path.append('/opt/homebrew/lib/python3.13/site-packages')
from pymongo import MongoClient

# MongoDB URI 설정   => 민지이름 링크 그대로 넣고 .net 뒤에 test 넣어줘야함 (/test) 가운데 부분은 비밀번호 입력!!
uri = "mongodb+srv://alswl3:cgwu3fo7eHzEmcf8@minjik.sotgr.mongodb.net/test"

try:
    # MongoDB 클라이언트 생성
    client = MongoClient(uri)
    db = client["myDatabase"]   # 데이터베이스 명 => capstone 추천
    collection = db["myCollection"]  # 테이블 명 => User, 공모전 등등

    # 데이터 삽입 테스트
    document = {"name": "gg", "age": 40}   # insert 문이라고 생각하면 됨
    result = collection.insert_one(document)
    print("Inserted document ID:", result.inserted_id)

    # 데이터 조회 테스트
    for doc in collection.find():   # select 문이라고 생각하면 됨
        print(doc)

except Exception as e:
    print("An error occurred:", e)

finally:
    # 클라이언트 닫기
    client.close()
