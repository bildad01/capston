import pymongo
import json
from datetime import datetime

# MongoDB 클라이언트 연결
myclient = pymongo.MongoClient("mongodb+srv://alswl3:cgwu3fo7eHzEmcf8@minjik.sotgr.mongodb.net/capston")  # MongoDB URI 설정
db = myclient["capston"]  # 데이터베이스 선택
collection = db["contest"]  # 컬렉션 선택
counter_collection = db["counters"]  # Auto-increment 관리를 위한 별도 컬렉션

# JSON 파일 읽기
with open("competitions.json", "r", encoding="utf-8") as file:
    competitions = json.load(file)

# contest_id 자동 증가 함수
def get_next_sequence(name):
    """해당 컬렉션에 대한 auto-increment 값 반환"""
    result = counter_collection.find_one_and_update(
        {"_id": name},
        {"$inc": {"sequence_value": 1}},
        upsert=True,  # 해당 문서가 없으면 생성
        return_document=pymongo.ReturnDocument.AFTER  # 업데이트 후 값을 반환
    )
    return result["sequence_value"]

# 데이터 처리 및 MongoDB에 삽입
for competition in competitions:
    # 중복 확인: "title" 필드를 기준으로 중복 데이터 체크
    if not collection.find_one({"title": competition["title"]}):
        # contest_id 생성
        competition["contest_id"] = get_next_sequence("contest")

        # MongoDB에 데이터 삽입
        collection.insert_one(competition)
    else:
        print(f"중복 데이터: {competition['title']}")

print("데이터 처리 및 삽입 완료.")
