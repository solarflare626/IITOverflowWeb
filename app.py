import requests
from flask import Flask, render_template, request, flash,session,redirect,url_for
from datetime import datetime
from urllib.parse import quote
from urllib.request import urlopen
import json
import os

app = Flask(__name__)
# @app.route('/', methods=['GET','POST'])
# def home(username=None):
#     return render_template("home.html")






@app.route('/', methods=['GET','POST'])
def question():



    url = 'http://iitoverflow.herokuapp.com/api/Questions?filter[include]=answers&filter[include]=tags'

    url2 = 'http://iitoverflow.herokuapp.com/api/Categories'
    response = requests.get(url2)
    categories= response.json()




    url3 = 'http://iitoverflow.herokuapp.com/api/Questions'
    response1 = requests.get(url)
    questions = response1.json()

   






    # html = urlopen(url).read().decode('utf-8')
    # questions = json.loads(html)

    print(str(questions))

    url1 = 'http://iitoverflow.herokuapp.com/api/Answers'
    html1 = urlopen(url1).read().decode('utf-8')
    answers = json.loads(html1)

    


    return render_template('question2.html', questions = questions, answers = answers, categories=categories)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, use_reloader=True,host='0.0.0.0',port=port)

