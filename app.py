from flask import Flask, render_template, request
import sqlite3
import json
import random

app = Flask(__name__)
app.debug = True

@app.route('/')
def home():
  return render_template('home.html')

@app.route('/cv/')
def cv():
  return render_template('cv.html')

@app.route('/contact/')
def contact():
  return render_template('contact.html')

@app.route('/projects/')
def projects():
  return render_template('projects.html')

@app.route('/projects/parxiv/')
def parxiv():
  db = sqlite3.connect('parxiv.db')
  SQL = '''
    SELECT word, sum(count)
    FROM authors
    GROUP BY word
    ORDER BY sum(count) DESC
    LIMIT 50;
  '''
  SQL = SQL.strip()
  results = db.execute(SQL).fetchall()
  context = {'results':json.dumps(results)}	
  return render_template('projects/parxiv.html',**context)

if __name__ == '__main__':
  app.run(host='0.0.0.0')