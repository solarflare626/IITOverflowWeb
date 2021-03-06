from flask import Flask, jsonify, request, session, render_template, url_for, redirect
import flask
import requests
import urllib.parse
from urllib.request import urlopen
import json
import os, sys

app = Flask(__name__)
app.secret_key = 'my very own secret key'
app.config['SESSION_TYPE'] = 'filesystem'
baseUrl = "http://iitoverflow.herokuapp.com/api/"

@app.route('/')
def index():
    return render_template('landingpage2.html')


@app.route('/categories', methods=['POST', 'GET'])
def fillup():
    url = (baseUrl + "Interests/findOne?filter[where][userId]=" + str(session['user']) + "")
    response = requests.get(url)

    if response.status_code == 200:
        return redirect(url_for('question'))
    else:
        if request.method == 'POST':
            ids = request.json['ids']
            for i in ids:
                requests.post(baseUrl    + 'Interests',
                              json={"categoryId": i, "userId": session['user']})
            return jsonify({"message": "ok"})

        else:
            url = (baseUrl + 'Categories')
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
    return jsonify({"userID": session['user'], 'message': 'okay'})


@app.route('/logout')
def logout():
    session.pop('user', None)
    session.pop('token', None)
    if 'user' in session:
        return jsonify({"message": "error"})
    return jsonify({"message": "okay"})


@app.route('/tags', methods=['GET', 'POST'])
def tagslist():
    curuser = str(session['user'])

    urlCategory = baseUrl + 'Categories?filter[include]=tags'

    catresponse = urlopen(urlCategory).read().decode('utf-8')
    categorylist = json.loads(catresponse)
 
    return render_template('tags.html', category=categorylist, curuser=curuser)

@app.route('/related/<int:qid>', methods=['GET', 'POST'])
def viewRelated(qid):
    curuser = str(session['user'])

    url = (baseUrl + 'Questions/'+str(qid)+'?filter={"include":[{"relation": "user"},{"relation": "tags"},{"relation": "category"},{"relation": "answers", "scope":{"include": [{"relation": "user"},{"relation": "comments", "scope":{"include":{"relation":"user"}}}]}}]}')
    question = requests.get(url)
    question = question.json()
    user = requests.get(baseUrl+'users/'+curuser)
    user = user.json()
    return render_template('viewSpesific.html', i=question, user=user, curuser=curuser)

@app.route('/newsfeed', methods=['GET', 'POST'])
def question():
    if session.get('user') == None:
        return render_template('landingpage2.html')
    else:
        curuser = str(session['user'])
        interests = baseUrl + 'users/' + curuser + '/interests'
        response = requests.get(interests)
        interests = response.json()
        interestsid = []
        
        notifications = baseUrl + 'users/' + curuser + '/notifications'
        notifications = requests.get(notifications).json()

        questionsid = []

        followingid = []

        # print(questionsid)

        following_questions = baseUrl + 'users/' + curuser + '/following'
        response = requests.get(following_questions)
        following_questions = response.json()

        for following in following_questions:
            followingid.append(following['id'])

        # print(followingid)

        for interest in interests:
            interestsid.append(interest['id'])

        # print(interestsid)
        # print(str(interestsid))

        url = baseUrl + 'Questions?filter={"where":{"or":[{"userId":' + curuser + '},{"userId":{"inq":' + str(
            followingid) + '}},{"categoryId":{"inq":' + str(
            interestsid) + '}}]},"counts":["upvotes","downvotes"],"include":[{"relation": "user"},{"relation": "answers", "scope":{"include": [{"relation": "user"}, {"relation": "comments", "scope":{"include":{"relation":"user"}}}]}}, {"relation":"category"}, {"relation": "tags"}]}'
        # print(url)
        response1 = requests.get(url)
        questions = response1.json()
        # print(questions)
        # print(response1)


        url2 = baseUrl + 'Categories'
        response = requests.get(url2)
        categories = response.json()
        user1 = requests.get(baseUrl + 'users/'+curuser+'')
        user = user1.json()

        # html = urlopen(url).read().decode('utf-8')
        # questions = json.loads(html)

        url1 = baseUrl + 'Answers?filter[include]=user'
        html1 = urlopen(url1).read().decode('utf-8')
        answers = json.loads(html1)

        url5 = baseUrl + 'Tags'
        html5 = urlopen(url5).read().decode('utf-8')
        tag_list = json.loads(html5)

        FollowerFollower = baseUrl + 'users/' + curuser + '?filter[counts]=followers&filter[counts]=following'

        followresponse = requests.get(FollowerFollower)
        followerfollowingcount = followresponse.json()

        leaderurl =baseUrl + 'users/leaderboard'
        leaderresponse = requests.get(leaderurl)
        leaderboard = leaderresponse.json()

       
        leader=[]
        j = 0
        for i in leaderboard:
            data = {}
            if j < 3:
                data['id'] = i['id']
                data['displayname'] = i['displayname']
                data['picture'] = i['picture']
                data['email'] = i['email']
                data['points'] = i['points']
                leader.append(data)
            else:
                break
            j=j+1

        newlist = []
        for i in tag_list:
            newlist.append(i['name'])
        
        #print(str(leader))
            
    followable = baseUrl + 'users/'+curuser+'/followable'
    response = requests.head(followable)
    s_code = response.status_code
    response3 =  requests.get(followable)
    followableusers = response3.json()

    followed = requests.get(baseUrl + 'users/'+curuser+'/following')
    followed = followed.json()

    notfollowed = followableusers

    #for i in followableusers:
    #    u = requests.head(baseUrl + 'users/'+curuser+'/following/rel/'+str(i['id']))
    #    if u.status_code == 404:
    #        notfollowed.append(i)

    return render_template('question2.html',notifications=notifications,followed=followed,following_questions=following_questions,interests=interests, leader=leader, curuser=curuser, user=user, tag_list=newlist, questions=questions, answers=answers, categories=categories, followableusers=notfollowed,usercount=followerfollowingcount)


@app.route('/profile/<int:id>', methods=['GET', 'POST'])
def profile(id):
    user = str(id)
    curr = session['user']
    curuser = str(curr)

    if id == curr:
        url = ('http://iitoverflow.herokuapp.com/api/users/'+user+'?filter[include]=questions&filter[include]=interests')
        response =   requests.get(url)
        json_object = response.json()
        url = ('http://iitoverflow.herokuapp.com/api/users/'+user +'/questionsfollowed?filter={"include":[{"relation":"user"}, {"relation":"answers", "scope":{"include": [{"relation":"user"}, {"relation":"comments"}, {"relation":"upvotes"}, {"relation":"downvotes"}]}}]}')
        response = requests.get(url)
        followed_questions = response.json()
        print(followed_questions)
        curl = ('http://iitoverflow.herokuapp.com/api/users/'+user +'?filter[counts]=followers&filter[counts]=following&filter[counts]=answers&filter[counts]=questionsfollowed&filter[counts]=questions&filter[counts]=interests&filter[include]=interests&filter[include]=followers&filter[include]=following&filter[include]=answers&filter[include]=questionsfollowed&filter[include]=questions&filter[questions]=category')
        response = requests.get(curl)
        posts = requests.get(baseUrl+'users/'+user+'/questions?filter={"include": [{"relation": "category"}, {"relation": "user"}, {"relation": "answers", "scope":{"include": [{"relation":"user"}, {"relation":"comments"}, {"relation":"upvotes"}, {"relation":"downvotes"}]}}]}')
        posts = posts.json()
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

        url = ('http://iitoverflow.herokuapp.com/api/users/'+user +'/questionsfollowed?filter={"include":[{"relation":"user"}, {"relation":"answers", "scope":{"include": [{"relation":"user"}, {"relation":"comments", "scope":{"include": {"relation": "user"}}}, {"relation":"upvotes"}, {"relation":"downvotes"}]}}]}')
        response = requests.get(url)
        followed_questions = response.json()
        
        url = ('http://iitoverflow.herokuapp.com/api/users/'+user +
            '/answers?filter[include]=user&filter[include]=question')
        response = requests.get(url)
        answered_questions = response.json()

        categories = requests.get('http://iitoverflow.herokuapp.com/api/Categories')
        categories = categories.json()

        followable = 'http://iitoverflow.herokuapp.com/api/users/'+curuser+'/followable'
        response = requests.head(followable)
        s_code = response.status_code
        response3 =  requests.get(followable)
        followableusers = response3.json()
        # followableusers1 = response3.json()     
        followed = requests.get('http://iitoverflow.herokuapp.com/api/users/'+curuser+'/following')
        followed = followed.json()

        notfollowed = []
        for user in followableusers:
            # print(user)
            u = requests.head('http://iitoverflow.herokuapp.com/api/users/'+curuser+'/following/rel/'+str(user["id"]))
            if u.status_code == 404:
                notfollowed.append(user)
        whotofollowusers = []
        j = 0
        for r in notfollowed:
            data1 = {} 
            if j < 3:
                data1['id'] = r['id']
                data1['displayname'] = r['displayname']
                data1['picture'] = r['picture']
                data1['email'] = r['email']
                whotofollowusers.append(data1)
            else:
                break
            j=j+1    

        # url = ('http://iitoverflow.herokuapp.com/api/users/' + user + '/answers?filter[include]=user&filter[include]=question')
        # response = requests.get(url)
        # answered_questions = response.json()

        # url = ('http://iitoverflow.herokuapp.com/api/users/' + user + '/questionsfollowed?filter={"include":{"relation":"user"}}')
        # response = requests.get(url)
        # followed_questions = response.json()
        me_interests = baseUrl + 'users/' + curuser + '/interests'
        response = requests.get(me_interests)
        me_interests = response.json()
        me_notifications = baseUrl + 'users/' + curuser + '/notifications'
        me_notifications = requests.get(me_notifications).json()
        me_following_questions = baseUrl + 'users/' + curuser + '/questionsfollowed'
        response = requests.get(me_following_questions)
        me_following_questions = response.json()
        me_followed = requests.get(baseUrl + 'users/'+curuser+'/following')
        me_followed = me_followed.json()
        me_user1 = requests.get(baseUrl + 'users/'+curuser+'')
        me_user = me_user1.json()
        return render_template('profile.html',posts = posts, me_user=me_user, me_notifications=me_notifications,me_followed=me_followed,me_following_questions=me_following_questions,me_interests=me_interests,whotofollowusers=whotofollowusers, categories=categories,json_object=json_object, json_object1=json_object1, followers=val3, following=val4, followed_questions=followed_questions, answers=val5, questionsfollowed=val6, questions=val7, interests=val8, answered_questions=answered_questions, curuser=curuser, followableusers=notfollowed, user= user)
    else:
        followurl = ('http://iitoverflow.herokuapp.com/api/users/'+curuser+ '/following/rel/'+user+'')
        response = requests.head(followurl)
        # print(response.status_code)
        s_code = response.status_code

        url = ('http://iitoverflow.herokuapp.com/api/users/'+user+'?filter[include]=questions&filter[include]=interests')
        # print(user)
        response = requests.get(url)
        json_object = response.json()
        url = ('http://iitoverflow.herokuapp.com/api/users/'+user +'/questionsfollowed?filter={"include":{"relation":"user"}}')
        response = requests.get(url)
        followed_questions = response.json()

        curl = ('http://iitoverflow.herokuapp.com/api/users/' + user + '?filter[counts]=followers&filter[counts]=following&filter[counts]=answers&filter[counts]=questionsfollowed&filter[counts]=questions&filter[counts]=interests&filter[include]=interests&filter[include]=followers&filter[include]=following&filter[include]=answers&filter[include]=questionsfollowed&filter[include]=questions')
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

        
        followable = 'http://iitoverflow.herokuapp.com/api/users/'+curuser+'/followable'
        response = requests.head(followable)
        s_scode = response.status_code
        response3 =  requests.get(followable)
        followableusers = response3.json()
        # followableusers1 = response3.json()     
        followed = requests.get('http://iitoverflow.herokuapp.com/api/users/'+curuser+'/following')
        followed = followed.json()

        notfollowed = []
        for user in followableusers:
            # print(user)
            u = requests.head('http://iitoverflow.herokuapp.com/api/users/'+curuser+'/following/rel/'+str(user["id"]))
            if u.status_code == 404:
                notfollowed.append(user)
        whotofollowusers = []
        j = 0
        for r in notfollowed:
            data1 = {} 
            if j < 3:
                data1['id'] = r['id']
                data1['displayname'] = r['displayname']
                data1['picture'] = r['picture']
                data1['email'] = r['email']
                whotofollowusers.append(data1)
            else:
                break
            j=j+1    
    
        me_interests = baseUrl + 'users/' + curuser + '/interests'
        response = requests.get(me_interests)
        me_interests = response.json()
        me_notifications = baseUrl + 'users/' + curuser + '/notifications'
        me_notifications = requests.get(me_notifications).json()
        me_following_questions = baseUrl + 'users/' + curuser + '/questionsfollowed'
        response = requests.get(me_following_questions)
        me_following_questions = response.json()
        me_followed = requests.get(baseUrl + 'users/'+curuser+'/following')
        me_followed = me_followed.json()
        me_user1 = requests.get(baseUrl + 'users/'+curuser+'')
        me_user = me_user1.json()
        return render_template('profileforOtherUser.html',me_user=me_user, me_notifications=me_notifications,me_followed=me_followed,me_following_questions=me_following_questions,me_interests=me_interests,whotofollowusers= whotofollowusers, followableusers= notfollowed, curr= curr, curuser= curuser, user=str(id), s_code= s_code, json_object=json_object, json_object1=json_object1, followers=val3, following=val4, followed_questions=followed_questions, answers=val5, questionsfollowed=val6, questions=val7, nswered_questions=answered_questions)

@app.route('/getCurrentUser', methods=['POST'])
def getSession():
    return jsonify({"message": str(session['user'])})


@app.route('/tagsQ/<int:id>', methods=['GET', 'POST'])
def tagsQ(id):
    curuser = str(session['user'])

    urlCategory = baseUrl + 'Tags/' + str(
        id) + '?filter={"include":[{"relation":"questions","scope":{"include":[{"relation":"user"},{"relation":"category"},{"relation":"upvotes"},{"relation":"answers","scope":{"include":"comments"}}]}}]}'

    catresponse = urlopen(urlCategory).read().decode('utf-8')
    categorylist = json.loads(catresponse)

    return render_template('specifictags.html', questions=categorylist['questions'], curuser=curuser)


@app.route('/search', methods=['POST','GET'])
def searchres():
    curuser = str(session['user'])
    searchbar = request.form['searchbar']
    test = urllib.parse.quote_plus(searchbar)
    if test == "":
        searched = []
        return render_template('search.html', searched=searched, curuser=curuser)
    else:
        user1 = requests.get(baseUrl + 'users/' + curuser + '')
        user = user1.json()

        url = (baseUrl + 'Questions?filter={"where":{"question":{"ilike":"%25' + test + '%25"}},"include":[{"relation": "user"},{"relation": "tags"},{"relation": "category"},{"relation": "answers", "scope":{"include": [{"relation": "user"},{"relation": "comments", "scope":{"include":{"relation":"user"}}}]}}]}')
        response = requests.get(url)
        searched = response.json()
        return render_template('search.html', searched=searched, curuser=curuser, user=user)

@app.route('/question/<string:id>', methods=['GET'])
def viewQuestion(id):
    curuser = str(session['user'])
    user1 = requests.get(baseUrl + 'users/' + curuser)
    user = user1.json()
    url = (baseUrl + 'Questions/'+id+'?filter={"include":[{"relation": "user"},{"relation": "tags"},{"relation": "category"},{"relation": "answers", "scope":{"include": [{"relation": "user"},{"relation": "comments", "scope":{"include":{"relation":"user"}}}]}}]}')
    response = requests.get(url)
    i = response.json()
    categories = requests.get(baseUrl + 'Categories')
    categories = categories.json()
    return render_template('viewSpesific.html', i=i, curuser=curuser, user=user, categories = categories)

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

