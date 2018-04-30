from flask import Flask, jsonify, request, render_template, url_for, redirect
import requests
from datetime import datetime
from urllib.parse import quote
from urllib.request import urlopen
import json
import os


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
 # <<<<<<< HEAD
        requests.post('http://iitoverflow.herokuapp.com/api/users/4/question', json={"question": question_title,"createdAt": date,  "updatedAt": date,"deletedAt": date,"questiondesc": question_desc, "userId": 1})
# =======
#         requests.post('http://iitoverflow.herokuapp.com/api/users/1/question', json={"question": question_title,"createdAt": date,  "updatedAt": date,"deletedAt": date,"questiondesc": question_desc, "userId": 1})
# >>>>>>> 1a897cf8dbf28f4e6bb370dfc45f7dfd943ca04b
        return redirect(url_for('question'))
    return render_template('questions.html')



# <<<<<<< HEAD
# @app.route('/profile/',methods=['GET','POST'])
# def profile():
#     curuser = 4
#     user =str(curuser)
#     url = ('http://iitoverflow.herokuapp.com/api/Questions?filter[where][userId]=' + user)
# =======
@app.route('/profile/<int:id>',methods=['GET','POST'])
def profile(id):
    user = str(id)
    url = ('http://iitoverflow.herokuapp.com/api/users/'+user+'?filter[include]=questions&filter[include]=interests')
    print(user)
# >>>>>>> 1a897cf8dbf28f4e6bb370dfc45f7dfd943ca04b
    response = requests.get(url)
    json_object = response.json()
    # html = urlopen(url).read().decode('utf-8')
    # questions = json.loads(html)

# <<<<<<< HEAD
#     # ParsedValue={}
#     # ParsedValue1={}
# =======
#     curl = ('http://iitoverflow.herokuapp.com/api/users/'+user+'?filter[counts]=followers&filter[counts]=following&filter[include]=followers&filter[include]=following')
#     response = requests.get(curl)
#     json_object1 = response.json()
#     val3 = json_object1['followersCount']
#     val4 = json_object1['followingCount']

#     url1 = ('http://http://iitoverflow.herokuapp.com/api/users/'+user+'/questionsfollowed?filter[include]=user')
#     response = requests.get(url1)
#     followed_questions = response.json()



#     return render_template('profile.html', json_object=json_object, json_object1=json_object1, followers=val3, following=val4, followed_questions = followed_questions)
# # >>>>>>> 1a897cf8dbf28f4e6bb370dfc45f7dfd943ca04b

    curl = ('http://iitoverflow.herokuapp.com/api/users/'+user+'?filter[counts]=followers&filter[counts]=following&filter[counts]=answers&filter[counts]=questionsfollowed&filter[include]=followers&filter[include]=following&filter[include]=answers&filter[include]=questionsfollowed')
    response = requests.get(curl)
    json_object1 = response.json()
    val3 = json_object1['followersCount']
    val4 = json_object1['followingCount']
    val5 = json_object1['answersCount']
    val6 = json_object1['questionsfollowedCount']

   
    return render_template('profile.html', json_object=json_object, json_object1=json_object1, followers=val3, following=val4, answers=val5, questionsfollowed=val6)

    

if __name__=='__main__':
# <<<<<<< HEAD
    app.run(debug=True)  
# =======
#     port = int(os.environ.get('PORT', 5000))
#     app.run(debug=True, host= '0.0.0.0', port=port)
# # >>>>>>> 1a897cf8dbf28f4e6bb370dfc45f7dfd943ca04b
