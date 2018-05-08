import requests
from flask import Flask, render_template, request, flash,session,redirect,url_for, Markup
from datetime import datetime
from urllib.parse import quote
from urllib.request import urlopen
import json
import os

app = Flask(__name__)



@app.route('/tags', methods=['GET','POST'])
def tagslist():
   
    urlCategory = 'http://iitoverflow.herokuapp.com/api/Categories?filter[include]=tags'   
    
    catresponse = urlopen(urlCategory).read().decode('utf-8')
    categorylist = json.loads(catresponse)


    return render_template('tags.html', category=categorylist)

@app.route('/tagsQ/<int:id>', methods=['GET','POST'])
def tagsQ(id):
   
    urlCategory = 'http://iitoverflow.herokuapp.com/api/Tags/' +str(id)+'?filter={"include":[{"relation":"questions","scope":{"include":[{"relation":"user"},{"relation":"category"},{"relation":"upvotes"},{"relation":"answers","scope":{"include":"comments"}}]}}]}'
    
    catresponse = urlopen(urlCategory).read().decode('utf-8')
    categorylist = json.loads(catresponse)


    return render_template('specifictags.html', questions= categorylist['questions'])


@app.route('/newsfeed', methods=['GET','POST'])
def question():



    url = 'http://iitoverflow.herokuapp.com/api/Questions?filter[include]=answers&filter[include]=tags'

    url2 = 'http://iitoverflow.herokuapp.com/api/Categories'
    response = requests.get(url2)
    categories= response.json()

    




    url3 = 'http://iitoverflow.herokuapp.com/api/Questions'
    response1 = requests.get(url)
    questions = response1.json()

   

    url1 = 'http://iitoverflow.herokuapp.com/api/Answers'
    html1 = urlopen(url1).read().decode('utf-8')
    answers = json.loads(html1)


    url5 = 'http://iitoverflow.herokuapp.com/api/Tags'
    html5 = urlopen(url5).read().decode('utf-8')
    tag_list = json.loads(html5)
    
    newlist = []
    for i in tag_list:
        newlist.append(i['name'])


    return render_template('question2.html', tag_list = newlist, questions = questions, answers = answers, categories=categories)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, use_reloader=True,host='0.0.0.0',port=port)

