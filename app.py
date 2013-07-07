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

@app.route('/projects/parxiv/', methods=['get','post'])
def parxiv():
  if request.method=='GET':
    gdb = graphdb("http://localhost:7474/db/data/")
    context = {}

    results, metadata = gdb.get_top_firstauthors_by_papercount(limit=10)
    context.update({'top_by_papercount':json.dumps(results)})

    results, metadata = gdb.get_top_firstauthors_by_citationcount(limit=10)
    context.update({'top_by_citationcount':json.dumps(results)})

    results, metadata = gdb.get_top_firstauthors_by_citationsperpaper(limit=10)
    context.update({'top_by_citationsperpaper':json.dumps(results)})

    return render_template('projects/parxiv.html',**context)
  if request.method=='POST':
    results = {"foo":"bar"}
    return json.dumps(results)


if __name__ == '__main__':
  app.run(host='0.0.0.0')