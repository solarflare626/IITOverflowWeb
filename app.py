from flask import Flask, jsonify, request, render_template, url_for, json
from datetime import datetime
import requests
import urllib

app = Flask(__name__)


@app.route('/', methods= ['POST', 'GET'])
def fillup():
    if request.method == 'POST':
        ids = request.json['ids']
        for i in ids:
            requests.post('http://localhost:3000/api/Interests?access_token=V4W9EdDy9iAACCotqJTot1XGyzxRYs4CSHCYlhVPJQHKoY1KpD2KUoWudDi5EgaH',json={"categoryId":i, "userId":1 })

        return render_template('landingpage2.html')

    else:
        url = ('http://localhost:3000/api/Categories?access_token=V4W9EdDy9iAACCotqJTot1XGyzxRYs4CSHCYlhVPJQHKoY1KpD2KUoWudDi5EgaH')
        response = requests.get(url)
        categories= response.json()

        return render_template('landingpage2.html',categories=categories)

if __name__=='__main__':
    app.run(debug=True)