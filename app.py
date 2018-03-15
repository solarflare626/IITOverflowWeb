from flask import Flask, jsonify, request, render_template
import json
import requests
import urllib

app = Flask(__name__)


@app.route('/')
def index():
	return render_template('index.html')


@app.route('/fillupform', methods=['POST','GET'])
def fillup():
	url = ('http://localhost:3000/api/Categories?access_token=V4W9EdDy9iAACCotqJTot1XGyzxRYs4CSHCYlhVPJQHKoY1KpD2KUoWudDi5EgaH')
	response = requests.get(url)
	json_object = response.json()

	categories = []

	for i in range(len(json_object)):
		categories.append(json_object[i]['name'])

	return render_template('test.html', categories=categories)


if __name__=='__main__':
	app.run(debug=True)