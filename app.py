import requests
import flask
import sys,os
import requests
from flask import Flask, render_template, request,session,redirect,url_for, jsonify, json

app = Flask(__name__)
app.secret_key = 'my very own secret key'
app.config['SESSION_TYPE'] = 'filesystem'

@app.route('/')
def index():
    return render_template('landingpage2.html')

@app.route('/categories', methods= ['POST', 'GET'])
def fillup():
    if request.method == 'POST':
        ids = request.json['ids']
        for i in ids:
            requests.post('http://iitoverflow.herokuapp.com/api/Interests',
                          json={"categoryId": i, "userId": 1})

        return render_template('login.html') #nextPage

    else:
        url = ('http://iitoverflow.herokuapp.com/api/Categories')
        response = requests.get(url)
        categories= response.json()

        return render_template('Categories.html',categories=categories)

@app.route('/login', methods=['POST'])
def login():
    params = request.get_json()
    u_token = params["id"]
    u_id = params["userID"]
    session['token'] = u_token
    session['user'] = u_id
    return jsonify({"userID": session['user'], 'message': 'okay'})
    # return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('user', None)
    session.pop('token', None)
    if 'user' in session:
        return jsonify({"message": "error"})

    return jsonify({"message": "okay"})

@app.route('/profile')
def pageOne():
    return render_template('login.html')

@app.after_request
def add_cors(resp):
    resp.headers['Access-Control-Allow-Origin'] = flask.request.headers.get('Origin', '*')
    resp.headers['Access-Control-Allow-Credentials'] = True
    resp.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS, GET, PUT, DELETE'
    resp.headers['Access-Control-Allow-Headers'] = flask.request.headers.get('Access-Control-Request-Headers',
                                                                             'Authorization')
    # set low for debugging

    if app.debug:
        resp.headers["Access-Control-Max-Age"] = '1'
    return resp


if __name__ == '__main__':
    app.run(host='localhost', debug=True)

