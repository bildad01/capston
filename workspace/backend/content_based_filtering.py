import requests

# Flask API에서 데이터 가져오기
response = requests.get("http://127.0.0.1:5000/contest/list")
data = response.json()  # JSON 데이터를 Python 리스트로 변환

# 각 공모전의 category와 target 정보를 결합하여 추천에 사용할 텍스트 준비
for item in data:
    item["combined_text"] = " ".join(item["category"] + item["target"])

print("추천에 사용할 데이터:")
for item in data:
    print(item["combined_text"])
