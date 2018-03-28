from flask import Flask, jsonify, request, render_template, url_for, redirect
import requests
from datetime import datetime
from urllib.parse import quote
from urllib.request import urlopen
import json


app = Flask(__name__)


@app.route('/')
def index():
	return render_template('index.html')


@app.route('/fillup')
def fillup():
	return render_template('fillup.html')



@app.route('/ask', methods=['GET','POST'])
def question():
    if request.method == 'POST':
        date = str(datetime.now())
        question_title = request.form['title']
        question_desc = request.form['desc']
        requests.post('http://localhost:3000/api/users/1/question', json={"question": question_title,"createdAt": date,  "updatedAt": date,"deletedAt": date,"questiondesc": question_desc, "userId": 1})
        return redirect(url_for('question'))
    return render_template('questions.html')



@app.route('/profile/',methods=['GET','POST'])
def profile():
    curuser = 1
    user =str(curuser)
    url = ('http://localhost:3000/api/Questions?filter[where][userId]=' + user)
    response = requests.get(url)
    json_object = response.json()
    # html = urlopen(url).read().decode('utf-8')
    # questions = json.loads(html)

    for i in range(len(json_object)):
        ParsedValue = json_object[i]['question']
        ParsedValue1 = json_object[i]['questiondesc']
        
    return render_template('profile.html', question=ParsedValue, description=ParsedValue1, json_object= json_object)


if __name__=='__main__':
	app.run(debug=True)