import requests
from flask import Flask, render_template, request, flash,session,redirect,url_for
from datetime import datetime
from urllib.parse import quote
from urllib.request import urlopen
import json


app = Flask(__name__)
@app.route('/', methods=['GET','POST'])
def home(username=None):
    return render_template("home.html")






@app.route('/ask', methods=['GET','POST'])
def question():
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

if __name__ == '__main__':
   app.run(debug=1)
