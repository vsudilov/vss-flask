from flask import Flask, render_template, request
import json
import random
from queries.neo4j import graphdb
from queries.sql import sqldb
import time

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
  gdb = graphdb("http://localhost:7474/db/data/")
  start = time.time()
  results, metadata = gdb.get_top_firstauthors_by_papercount(limit=10)
  print "%0.2f seconds" % (time.time()-start)
  context = {'results':json.dumps(results)}
  return render_template('projects/parxiv.html',**context)

if __name__ == '__main__':
  app.run(host='0.0.0.0')