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
        requests.post('http://iitoverflow.herokuapp.com/api/users/4/question', json={"question": question_title,"createdAt": date,  "updatedAt": date,"deletedAt": date,"questiondesc": question_desc, "userId": 1})
        return redirect(url_for('question'))
    return render_template('questions.html')



@app.route('/profile/',methods=['GET','POST'])
def profile():
    curuser = 4
    user =str(curuser)
    url = ('http://iitoverflow.herokuapp.com/api/Questions?filter[where][userId]=' + user)
    response = requests.get(url)
    json_object = response.json()
    # html = urlopen(url).read().decode('utf-8')
    # questions = json.loads(html)

    # ParsedValue={}
    # ParsedValue1={}

    # for i in range(len(json_object)):
    #     ParsedValue = json_object[i]['question']
    #     ParsedValue1 = json_object[i]['questiondesc']

    curl = ('http://iitoverflow.herokuapp.com/api/users/'+user+'?filter[counts]=followers&filter[counts]=following&filter[counts]=answers&filter[counts]=questionsfollowed&filter[include]=followers&filter[include]=following&filter[include]=answers&filter[include]=questionsfollowed')
    response = requests.get(curl)
    json_object1 = response.json()
    val3 = json_object1['followersCount']
    val4 = json_object1['followingCount']
    val5 = json_object1['answersCount']
    val6 = json_object1['questionsfollowedCount']

   
        
    return render_template('profile.html', json_object=json_object, json_object1=json_object1, followers=val3, following=val4, answers=val5, questionsfollowed=val6)

    

if __name__=='__main__':
    app.run(debug=True)  
