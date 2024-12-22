import pymongo
import json

# MongoDB 클라이언트 연결
myclient = pymongo.MongoClient("mongodb+srv://alswl3:cgwu3fo7eHzEmcf8@minjik.sotgr.mongodb.net/")
db = myclient["test"]

# JSON 파일 읽기
with open("competitions.json", "r", encoding="utf-8") as file:
    competitions = json.load(file)

# MongoDB에 데이터 삽입
db.gongmojeon.insert_many(competitions)
