from flask import Flask, jsonify, request, session, redirect, url_for
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson.objectid import ObjectId
import datetime
from bson.json_util import dumps
from werkzeug.security import generate_password_hash, check_password_hash
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import requests

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.config["MONGO_URI"] = "['몽고디비 주소']"
app.secret_key = "['몽고디비 비번']"
mongo = PyMongo(app)


# 공모전자료 전체 정보 가져오기 
@app.route('/post/list', methods=['GET'])
def get_posts():
    try:
        # 필요한 필드만 선택해서 가져오기 (_id, title, content)
        helper = mongo.db["helper"].find()
        result = []
        for post in helper:
            result.append({
                "_id": str(post.get("_id")),  # ObjectId를 문자열로 변환
                "title": post.get("title", "No title"),
                "content": post.get("content", "No content")
            })

        if not result:
            return jsonify({"message": "No posts found"}), 404

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 공모전자료 상세정보 가져오기 
@app.route('/post/detail/<id>', methods=['GET'])
def get_post(id):
    try:
        # _id가 주어진 id와 일치하는 게시글 찾기
        post = mongo.db["helper"].find_one({"_id": ObjectId(id)})
        if post:
            return jsonify({
                "_id": str(post["_id"]),
                "title": post.get("title", "No title"),
                "content": post.get("content", "No content")
            }), 200
        else:
            return jsonify({"message": "Post not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500



# Contest 전체 정보 가져오기 
@app.route('/contest/list', methods=['GET'])
def get_contests():

    try:
        mongo.db.command('ping')
        print("MongoDB 연결 성공")
    except Exception as e:
        print(f"MongoDB 연결 실패: {e}")
        return jsonify({"error": "MongoDB 연결 실패"}), 500

    contest = mongo.db["contest"].find()
    contest_list = list(contest)
    
    result = []
    for item in contest_list:
        result.append({
            "_id": str(item.get("_id")),
            "title": item.get("title", "No title"),
            "category": item.get("category", "No category"),
            "organizer": item.get("organizer", "No organizer"),
            "views": item.get("views", "No views"),
            "link": item.get("link", "No link"),
            "img_url": item.get("img_url", "No image URL"),
            "target": item.get("target", "No target"),
            "prize": item.get("prize", "No prize"),
            "homepage": item.get("homepage", "No homepage"),
            "contest_id": item.get("contest_id", "No contest_id"),
            "start_date": item.get("start_date", "No start date"),
            "end_date": item.get("end_date", "No end date")
        })
    
    return jsonify(result)


# Contest 상세 정보 가져오기 
@app.route('/contest/detail/<string:contest_id>', methods=['GET'])
def get_contest_detail(contest_id):
    """
    _id 값을 기반으로 특정 contest의 상세 정보를 반환하는 API
    """
    try:
        mongo.db.command('ping')
        print("MongoDB 연결 성공")
    except Exception as e:
        print(f"MongoDB 연결 실패: {e}")
        return jsonify({"error": "MongoDB 연결 실패"}), 500

    try:
        contest = mongo.db["contest"].find_one({"_id": ObjectId(contest_id)})
        if not contest:
            return jsonify({"error": "해당 contest를 찾을 수 없습니다."}), 404

        result = {
            "_id": str(contest.get("_id")),
            "title": contest.get("title", "No title"),
            "category": contest.get("category", "No category"),
            "organizer": contest.get("organizer", "No organizer"),
            "views": contest.get("views", "No views"),
            "link": contest.get("link", "No link"),
            "img_url": contest.get("img_url", "No image URL"),
            "target": contest.get("target", "No target"),
            "prize": contest.get("prize", "No prize"),
            "homepage": contest.get("homepage", "No homepage"),
            "description": contest.get("description", "No description"),
            "contest_id": contest.get("contest_id", "No contest_id"),
            "start_date": contest.get("start_date", "No start date"),
            "end_date": contest.get("end_date", "No end date")
        }

        return jsonify(result), 200

    except Exception as e:
        print(f"데이터 조회 중 오류 발생: {e}")
        return jsonify({"error": "서버 오류가 발생했습니다."}), 500


# Eeca 전체 정보 가져오기 
@app.route('/eeca/list', methods=['GET'])
def get_eecas():
    try:
        mongo.db.command('ping')
        print("MongoDB 연결 성공")
    except Exception as e:
        print(f"MongoDB 연결 실패: {e}")
        return jsonify({"error": "MongoDB 연결 실패"}), 500
    
    eeca = mongo.db["eeca"].find()
    eeca_list = list(eeca)

    result = []
    for item in eeca_list:
        result.append({
            "_id": str(item.get("_id")),
            "title": item.get("title","No title"),
            "category": item.get("category","No category"),
            "organizer": item.get("organizer","No organizer"),
            "views": item.get("views",0),
            "Application": item.get("Application",0),
            "img_url": item.get("img_url","No image URL"),
            "target": item.get("target", "No target"),
            "prize": item.get("prize", 0),
            "homepage": item.get("homepage","No homepage"),
            "eeca_id": item.get("eeca_id", "No eeca_id"),
            "start_date": item.get("start_date","No start date"),
            "end_date": item.get("end_date","No end date")
        })

    return jsonify(result)


# Eeca 상세 정보 가져오기 
@app.route('/eeca/detail/<string:eeca_id>', methods=['GET'])
def get_eeca_detail(eeca_id):
    """
    _id 값을 기반으로 특정 eeca의 상세 정보를 반환하는 API
    """
    try:
        mongo.db.command('ping')
        print("MongoDB 연결 성공")
    except Exception as e:
        print(f"MongoDB 연결 실패: {e}")
        return jsonify({"error": "MongoDB 연결 실패"}), 500

    try:
        eeca = mongo.db["eeca"].find_one({"_id": ObjectId(eeca_id)})
        if not eeca:
            return jsonify({"error": "해당 eeca를 찾을 수 없습니다."}), 404

        result = {
            "_id": str(eeca.get("_id")),
            "title": eeca.get("title", "No title"),
            "category": eeca.get("category", "No category"),
            "organizer": eeca.get("organizer", "No organizer"),
            "views": eeca.get("views", "No views"),
            "link": eeca.get("link", "No link"),
            "img_url": eeca.get("img_url", "No image URL"),
            "target": eeca.get("target", "No target"),
            "prize": eeca.get("prize", "No prize"),
            "homepage": eeca.get("homepage", "No homepage"),
            "eeca_id": eeca.get("eeca_id", "No eeca_id"),
            "start_date": eeca.get("start_date", "No start date"),
            "end_date": eeca.get("end_date", "No end date")
        }

        return jsonify(result), 200

    except Exception as e:
        print(f"데이터 조회 중 오류 발생: {e}")
        return jsonify({"error": "서버 오류가 발생했습니다."}), 500


# 게시물 리스트 불러오기
@app.route('/board/list', methods=['GET'])
def get_board_posts():
    try:
        board_posts = mongo.db["board"].find()
        result = []

        for post in board_posts:
            contest_info = None
            eeca_info = None

            if post.get("contest_id"):
                contest_info = mongo.db["contest"].find_one({"contest_id": post["contest_id"]})
            
            if post.get("eeca_id"):
                eeca_info = mongo.db["eeca"].find_one({"eeca_id": post["eeca_id"]})

            result.append({
                "_id": str(post.get("_id")),
                "board_title": post.get("board_title"),
                "board_post": post.get("board_post"),
                "name" : post.get("name"),
                "contest_title": contest_info["title"] if contest_info else None,
                "eeca_title": eeca_info["title"] if eeca_info else None,
                "created_at": post.get("created_at"),
                "views" : post.get("views")
            })

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 게시물 작성하기기
@app.route('/board/create', methods=['POST'])
def create_board_post():
    try:
        data = request.json
        print(f"Received data: {data}")

        if not data.get("board_title") or not data.get("board_post") or not data.get("name"):
            return jsonify({"error": "필수 항목이 누락되었습니다."}), 400

        contest_id = data.get("contest_id")
        eeca_id = data.get("eeca_id")

        board_post = {
            "board_title": data["board_title"],
            "board_post": data["board_post"],
            "name": data["name"],
            "contest_id": contest_id if contest_id else None,
            "eeca_id": eeca_id if eeca_id else None,
            "created_at": datetime.datetime.utcnow(),
            "views": 0 
        }

        print(f"Prepared board post: {board_post}")

        mongo.db["board"].insert_one(board_post)

        return jsonify({"success": True, "message": "게시글이 성공적으로 생성되었습니다."}), 201

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": str(e)}), 500

# 게시물 상세내용 조회하기
@app.route('/board/detail/<post_id>', methods=['GET'])
def get_board_post_detail(post_id):
    try:
        post = mongo.db["board"].find_one({"_id": ObjectId(post_id)})

        if not post:
            return jsonify({"error": "게시글을 찾을 수 없습니다."}), 404
        
        contest_info = None
        eeca_info = None

        # 공모전 정보 가져오기
        if post.get("contest_id"):
            # contest_id가 ObjectId가 아닌 int일 경우 처리
            contest_id = post["contest_id"]
            if isinstance(contest_id, int):  # contest_id가 int일 경우
                contest_info = mongo.db["contest"].find_one({"contest_id": contest_id})
            else:
                contest_info = mongo.db["contest"].find_one({"_id": ObjectId(contest_id)})
        
        # 비교과 정보 가져오기
        if post.get("eeca_id"):
            # eeca_id가 ObjectId가 아닌 int일 경우 처리
            eeca_id = post["eeca_id"]
            if isinstance(eeca_id, int):  # eeca_id가 int일 경우
                eeca_info = mongo.db["eeca"].find_one({"eeca_id": eeca_id})
            else:
                eeca_info = mongo.db["eeca"].find_one({"_id": ObjectId(eeca_id)})
        
        # 조회수 증가
        mongo.db["board"].update_one(
            {"_id": ObjectId(post_id)},
            {"$inc": {"views": 0.5}}
        )

        # 게시글 반환
        return jsonify({
            "_id": str(post["_id"]),
            "board_title": post["board_title"],
            "board_post": post["board_post"],
            "name" : post["name"],
            "created_at": post["created_at"],
            "views": post["views"], 
            "contest_title": contest_info["title"] if contest_info else None,
            "contest_id": str(contest_info["_id"]) if contest_info else None, 
            "eeca_title": eeca_info["title"] if eeca_info else None,
            "eeca_id": str(eeca_info["_id"]) if eeca_info else None, 
        })

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": str(e)}), 500


# 회원가입하기
@app.route('/join', methods=['POST'])
def join():
    try:
        data = request.json

        required_fields = ["user_id", "password", "department", "name", "age", "gender"]
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"{field} 필수 항목이 누락되었습니다."}), 400

        hashed_password = generate_password_hash(data["password"])

        if mongo.db["user"].find_one({"user_id": data["user_id"]}):
            return jsonify({"error": "이미 사용 중인 user_id입니다."}), 400

        new_user = {
            "user_id": data["user_id"],
            "password": hashed_password,
            "department": data["department"],
            "name": data["name"],
            "age": int(data["age"]),
            "gender": data["gender"],
            "created_at": datetime.datetime.utcnow()
        }

        mongo.db["user"].insert_one(new_user)

        return jsonify({"success": True, "message": "회원가입이 성공적으로 완료되었습니다."}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 로그인 하기 + 세션 정보 생성하기
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        user_id = data.get("user_id")
        password = data.get("password")

        if not user_id or not password:
            return jsonify({"error": "user_id와 password는 필수입니다."}), 400

        user_data = mongo.db["user"].find_one({"user_id": user_id})
        if not user_data:
            return jsonify({"error": "user_id 또는 password가 잘못되었습니다."}), 401

        if not check_password_hash(user_data["password"], password):
            return jsonify({"error": "user_id 또는 password가 잘못되었습니다."}), 401

        session['user_id'] = user_data["user_id"]
        session['name'] = user_data["name"]
        session['department'] = user_data["department"]

        print(f"세션 데이터: {session}")  # 세션 값 확인

        return jsonify({
            "success": True,
            "message": "로그인 성공",
            "session": {
                "user_id": session['user_id'],
                "name": session['name'],
                "department": session['department']
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 로그아웃 하기 + 세션 정보 빼기
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"success": True, "message": "로그아웃되었습니다."}), 200

# 세션이 아직 존재하는지 확인하기
@app.route('/session/check', methods=['GET'])
def check_session():
    if 'user_id' in session:
        return jsonify({"logged_in": True, "user": {
            "user_id": session.get("user_id"),
            "name": session.get("name"),
            "department": session.get("department")
        }}), 200
    else:
        return jsonify({"logged_in": False, "message": "로그인 필요"}), 401


# 데이터 전처리 함수
def prepare_recommendation_data(data):
    cleaned_data = []
    for item in data:
        combined_text = " ".join(item.get("category", []) + item.get("target", []))
        combined_text = combined_text.replace("기타", "").replace("제한없음", "").strip()
        item["combined_text"] = combined_text
        cleaned_data.append(item)
    return cleaned_data

# 유사 공모전 추천 함수
def get_similar_contests(contest_index, similarity_matrix, data, top_n=5):
    similarity_scores = list(enumerate(similarity_matrix[contest_index]))
    sorted_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
    recommended_contests = [data[i] for i, score in sorted_scores[1:top_n+1]]
    return recommended_contests

# 추천 API 엔드포인트
@app.route('/recommend', methods=['GET'])
def recommend_contests():
    # 공모전 ID 가져오기
    contest_id = request.args.get('contest_id')
    if not contest_id:
        return jsonify({"error": "contest_id가 제공되지 않았습니다."}), 400

    # MongoDB에서 데이터 가져오기
    raw_data = list(mongo.db["contest"].find({}))
    if not raw_data:
        return jsonify({"error": "데이터가 없습니다."}), 500

    # 데이터 전처리
    processed_data = prepare_recommendation_data(raw_data)

    # 공모전 ID로 인덱스 찾기
    contest_index = next((i for i, item in enumerate(processed_data) if str(item["_id"]) == contest_id), None)
    if contest_index is None:
        return jsonify({"error": "공모전을 찾을 수 없습니다."}), 404

    # TF-IDF와 코사인 유사도 계산
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([item["combined_text"] for item in processed_data])
    similarity_matrix = cosine_similarity(tfidf_matrix)

    # 추천 결과
    recommended_contests = get_similar_contests(contest_index, similarity_matrix, processed_data)

    # 응답 데이터 구조
    response_data = [
        {
            "_id": str(item["_id"]),
            "title": item.get("title", "No title"),
            "category": item.get("category", []),
            "img_url": item.get("img_url", ""),
        }
        for item in recommended_contests
    ]

    return jsonify(response_data)


if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
