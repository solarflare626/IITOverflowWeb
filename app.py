import requests
from flask import Flask, render_template, request, flash,session,redirect,url_for
from datetime import datetime
from urllib.parse import quote
from urllib.request import urlopen
import json
from datetime import datetime


app = Flask(__name__)

@app.route('/', methods=['GET','POST'])
def home(username=None):
    return render_template("home.html")






@app.route('/ask', methods=['GET','POST'])
def question():

    if request.method == 'POST':
        question_title = request.form['text']
        question_desc = request.form['textarea']
        requests.post('http://localhost:3000/api/Questions', json={"question": question_title, "questiondesc": question_desc,})
        return redirect(url_for('question'))




    else:
        
        url = 'http://localhost:3000/api/Questions?filter[include]=answers'
        html = urlopen(url).read().decode('utf-8')
        questions = json.loads(html)


        print(str(questions))

        url1 = 'http://localhost:3000/api/Answers'
        html1 = urlopen(url1).read().decode('utf-8')
        answers = json.loads(html1)


        print(str(questions))
        return render_template('question.html', questions = questions, answers = answers)

if __name__ == '__main__':
   app.run(debug=1)
