from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime

auth_blueprint = Blueprint('auth', __name__)

# MongoDB는 app.py에서 제공받을 예정
db = None

@auth_blueprint.before_app_request
def init_db():
    global db
    db = auth_blueprint.root_path.config['db']

# 회원가입 라우트
@auth_blueprint.route('/register', methods=['POST'])
def register():
    data = request.json
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password are required!'}), 400

    hashed_password = generate_password_hash(data['password'], method='sha256')
    if db.users.find_one({'email': data['email']}):
        return jsonify({'message': 'User already exists!'}), 400

    db.users.insert_one({
        'email': data['email'],
        'password': hashed_password
    })
    return jsonify({'message': 'User registered successfully!'}), 201

# 로그인 라우트
@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password are required!'}), 400

    user = db.users.find_one({'email': data['email']})
    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({'message': 'Invalid email or password!'}), 401

    token = jwt.encode({
        'user_id': str(user['_id']),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }, auth_blueprint.root_path.config['SECRET_KEY'], algorithm="HS256")

    return jsonify({'token': token}), 200
