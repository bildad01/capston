#eeca_mongo.py 엑셀을 제이슨으로 변환 후, 몽고디비 넣기

import pymongo
import json
import pandas as pd
from datetime import datetime

# MongoDB 클라이언트 연결
myclient = pymongo.MongoClient("mongodb+srv://alswl3:cgwu3fo7eHzEmcf8@minjik.sotgr.mongodb.net/capston")  # MongoDB URI 설정
db = myclient["capston"]  # 데이터베이스 선택
collection = db["eeca"]  # 컬렉션 선택
counter_collection = db["eecaer"]  # Auto-increment 관리를 위한 별도 컬렉션

# 엑셀 파일을 읽어 JSON으로 변환
excel_file = 'eeca.xlsx'  # 엑셀 파일 경로
df = pd.read_excel(excel_file, engine='openpyxl')

# DataFrame을 JSON 형식으로 변환
competitions = df.to_dict(orient='records')

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
