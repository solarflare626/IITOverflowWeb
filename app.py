from flask import Flask, jsonify, request, render_template



app = Flask(__name__)


@app.route('/')
def index():
	return render_template('index.html')


@app.route('/fillup')
def fillup():
	return render_template('fillup.html')


if __name__=='__main__':
	app.run(debug=True)