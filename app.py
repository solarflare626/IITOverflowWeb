import requests
from flask import Flask, render_template, request, flash,session,redirect,url_for
from datetime import datetime


app = Flask(__name__)

@app.route('/')
def index():
	return render_template('index.html')


@app.route('/fillup')
def fillup():
	return render_template('fillup.html')

@app.route('/', methods=['GET','POST'])
def question():
    if request.method == 'POST':
        date = str(datetime.now())
        question_title = request.form['text']
        question_desc = request.form['textarea']
        response = requests.post('http://localhost:3000/api/Questions', json={"question": question_title,"createdAt": date,  "updatedAt": date,"deletedAt": date,"questiondesc": question_desc,})
        return redirect(url_for('question'))
    return render_template('index.html')

if __name__ == '__main__':
   app.run(debug=1)