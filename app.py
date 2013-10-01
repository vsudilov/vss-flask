from flask import Flask, render_template, request
import json
import random
from queries.neo4j import graphdb
from queries.sql import sqldb
import time
import unicodedata
import cPickle as pickle

app = Flask(__name__)
app.debug = True

def sanitize(value): #Quick hack until the database is sanitized
  if type(value)==unicode:
    return unicodedata.normalize('NFKD',value.replace(u'\xc3\xbc','ue')).encode('ascii', 'ignore') #Manually put "ue" in u-umlaut...Need to use a better solution eventually
  return value

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

@app.route('/projects/mgii')
def mgii():
  return render_template('mgii.html')

@app.route('/projects/grbs')
def grbs():
  return render_template('grbs.html')

@app.route('/projects/grond')
def grond():
  return render_template('grond.html')

@app.route('/projects/parxiv/', methods=['get','post'])
def parxiv():
  if request.method=='GET':
    with open('neo4j.cached','r') as f:
      context = pickle.load(f)

    return render_template('projects/parxiv.html',**context)

  if request.method=='POST':
    results = {"foo":"bar"}
    return json.dumps(results)


if __name__ == '__main__':
  app.run(host='0.0.0.0')