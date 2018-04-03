import requests
import flask
import sys,os
from flask import Flask, render_template, request, flash,session,redirect,url_for, jsonify
from datetime import datetime
from urllib.parse import quote
from urllib.request import urlopen
import json


app = Flask(__name__)
app.secret_key = 'my very own secret key'
app.config['SESSION_TYPE'] = 'filesystem'


# @app.route('/', methods=['GET','POST'])
# def home(username=None):
#     return render_template("home.html")


@app.route('/')
def index():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    params = request.get_json()
    u_id = params['data']
    session['user'] = u_id
    return jsonify({"message": "okay"})

@app.route('/getSession')
def currentSession():
    if 'user' in session:
        return session['user']
    else:
        return "Please Login"

@app.route('/logout')
def logout():
    session.pop('user', None)
    if 'user' in session:
        return jsonify({"message": "error"})

    return jsonify({"message": "okay"})

@app.route('/ask', methods=['GET','POST'])
def question():

    if request.method == 'POST':
        question_title = request.form['text']
        question_desc = request.form['textarea']
        requests.post('http://localhost:3000/api/Questions', json={"question": question_title, "questiondesc": question_desc,})
        return redirect(url_for('question'))

    else:  
        url = 'http://localhost:3000/api/Questions?filter[include]=answers'
        url2 = 'http://localhost:3000/api/Categories'
        response = requests.get(url2)
        categories= response.json()

        html = urlopen(url).read().decode('utf-8')
        questions = json.loads(html)


        print(str(questions))

        url1 = 'http://localhost:3000/api/Answers'
        html1 = urlopen(url1).read().decode('utf-8')
        answers = json.loads(html1)


        print(str(questions))
        return render_template('question2.html', questions = questions, answers = answers, categories=categories)

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



