from flask import Flask, jsonify, request, session, render_template
import flask
import requests
from urllib.request import urlopen
import json
import os, sys

app = Flask(__name__)
app.secret_key = 'my very own secret key'
app.config['SESSION_TYPE'] = 'filesystem'


@app.route('/')
def index():
    return render_template('landingpage2.html')

@app.route('/categories', methods=['POST', 'GET'])
def fillup():
    if request.method == 'POST':
        ids = request.json['ids']
        for i in ids:
            requests.post('http://iitoverflow.herokuapp.com/api/Interests',
                          json={"categoryId": i, "userId": session['user']})
        return jsonify({"message": "ok"})

    else:
        url = ('http://iitoverflow.herokuapp.com/api/Categories')
        response = requests.get(url)
        categories = response.json()

        return render_template('Categories.html', categories=categories)


@app.route('/login', methods=['POST'])
def login():
    params = request.get_json()
    u_token = params["id"]
    u_id = params["userID"]
    session['token'] = u_token
    session['user'] = u_id
    print(session['user'])
    return jsonify({"userID": session['user'], 'message': 'okay'})


@app.route('/logout')
def logout():
    session.pop('user', None)
    session.pop('token', None)
    if 'user' in session:
        return jsonify({"message": "error"})
    return jsonify({"message": "okay"})



@app.route('/tags', methods=['GET','POST'])
def tagslist():
   
    urlCategory = 'http://iitoverflow.herokuapp.com/api/Categories?filter[include]=tags'   
    
    catresponse = urlopen(urlCategory).read().decode('utf-8')
    categorylist = json.loads(catresponse)


    return render_template('tags.html', category=categorylist)



@app.route('/newsfeed', methods=['GET','POST'])
def question():
    curuser = str(session['user'])
    url = 'http://iitoverflow.herokuapp.com/api/Questions?filter={"include":[{"relation": "answers", "scope":{"include": {"relation": "user"}}}, {"relation":"category"}, {"relation": "tags"}]}'

    url2 = 'http://iitoverflow.herokuapp.com/api/Categories'
    response = requests.get(url2) 
    categories= response.json()
    
    response1 = requests.get(url)
    questions = response1.json()

    # html = urlopen(url).read().decode('utf-8')
    # questions = json.loads(html)

    url1 = 'http://iitoverflow.herokuapp.com/api/Answers?filter[include]=user'
    html1 = urlopen(url1).read().decode('utf-8')
    answers = json.loads(html1)

    url5 = 'http://iitoverflow.herokuapp.com/api/Tags'
    html5 = urlopen(url5).read().decode('utf-8')
    tag_list = json.loads(html5)
    
    newlist = []
    for i in tag_list:
        newlist.append(i['name'])

    return render_template('question2.html', curuser =curuser, tag_list=newlist, questions=questions, answers=answers, categories=categories)

@app.route('/profile/<int:id>', methods=['GET', 'POST'])
def profile(id):
    user = str(id)
    curr = session['user']
    curuser = str(curr)
    print(curr)
    if id == curr:
        url = ('http://iitoverflow.herokuapp.com/api/users/'+user+'?filter[include]=questions&filter[include]=interests')
        print(user)
        response =   requests.get(url)
        json_object = response.json()
        url = ('http://iitoverflow.herokuapp.com/api/users/'+user +'/questionsfollowed?filter={"include":{"relation":"user"}}')
        response = requests.get(url)
        followed_questions = response.json()

        curl = ('http://iitoverflow.herokuapp.com/api/users/'+user +'?filter[counts]=followers&filter[counts]=following&filter[counts]=answers&filter[counts]=questionsfollowed&filter[counts]=questions&filter[counts]=interests&filter[include]=interests&filter[include]=followers&filter[include]=following&filter[include]=answers&filter[include]=questionsfollowed&filter[include]=questions')
        response = requests.get(curl)
        json_object1 = response.json()
        val3 = json_object1['followersCount']
        val4 = json_object1['followingCount']
        val5 = json_object1['answersCount']
        val6 = json_object1['questionsfollowedCount']
        val7 = json_object1['questionsCount']
        val8 = json_object1['interests']

        url = ('http://iitoverflow.herokuapp.com/api/users/'+user +'/answers?filter[include]=user&filter[include]=question')
        response = requests.get(url) 
        answered_questions = response.json()

        url = ('http://iitoverflow.herokuapp.com/api/users/'+user +
            '/questionsfollowed?filter={"include":{"relation":"user"}}')
        response = requests.get(url)
        followed_questions = response.json()
        
        url = ('http://iitoverflow.herokuapp.com/api/users/'+user +
            '/answers?filter[include]=user&filter[include]=question')
        response = requests.get(url)
        answered_questions = response.json()

        categories = requests.get('http://iitoverflow.herokuapp.com/api/Categories')
        categories = categories.json()

        followable = 'http://iitoverflow.herokuapp.com/api/users/'+curuser+'/followable'

        response3 =  requests.get(followable)
        followableusers = response3.json()


        return render_template('profile.html', categories=categories,json_object=json_object, json_object1=json_object1, followers=val3, following=val4, followed_questions=followed_questions, answers=val5, questionsfollowed=val6, questions=val7, interests=val8, answered_questions=answered_questions, curuser=curuser, followableusers=followableusers)
    else:
        followurl = ('http://iitoverflow.herokuapp.com/api/users/'+curuser+ '/following/rel/'+user+'')
        response = requests.head(followurl)
        print(response.status_code)
        s_code = response.status_code

        url = ('http://iitoverflow.herokuapp.com/api/users/'+user+'?filter[include]=questions&filter[include]=interests')
        print(user)
        response = requests.get(url)
        json_object = response.json()
        url = ('http://iitoverflow.herokuapp.com/api/users/'+user +'/questionsfollowed?filter={"include":{"relation":"user"}}')
        response = requests.get(url)
        followed_questions = response.json()

        curl = ('http://iitoverflow.herokuapp.com/api/users/'+user +'?filter[counts]=followers&filter[counts]=following&filter[counts]=answers&filter[counts]=questionsfollowed&filter[counts]=questions&filter[include]=followers&filter[include]=following&filter[include]=answers&filter[include]=questionsfollowed&filter[include]=questions')
        response = requests.get(curl)
        json_object1 = response.json()
        val3 = json_object1['followersCount']
        val4 = json_object1['followingCount']
        val5 = json_object1['answersCount']
        val6 = json_object1['questionsfollowedCount']
        val7 = json_object1['questionsCount']

        url = ('http://iitoverflow.herokuapp.com/api/users/'+user +'/answers?filter[include]=user&filter[include]=question')
        response = requests.get(url)
        answered_questions = response.json()


        return render_template('profileforOtherUser.html',curr= curr, curuser= curuser, user=str(id), s_code= s_code, json_object=json_object, json_object1=json_object1, followers=val3, following=val4, followed_questions=followed_questions, answers=val5, questionsfollowed=val6, questions=val7, nswered_questions=answered_questions)


@app.route('/getCurrentUser', methods=['POST'])
def getSession():
    return jsonify({"message": str(session['user'])})

@app.route('/tagsQ/<int:id>', methods=['GET','POST'])
def tagsQ(id):
   
    urlCategory = 'http://iitoverflow.herokuapp.com/api/Tags/' +str(id)+'?filter={"include":[{"relation":"questions","scope":{"include":[{"relation":"user"},{"relation":"category"},{"relation":"upvotes"},{"relation":"answers","scope":{"include":"comments"}}]}}]}'
    
    catresponse = urlopen(urlCategory).read().decode('utf-8')
    categorylist = json.loads(catresponse)


    return render_template('specifictags.html', questions= categorylist['questions'])



@app.after_request
def add_cors(resp):
    resp.headers['Access-Control-Allow-Origin'] = flask.request.headers.get(
        'Origin', '*')
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

