from flask import Flask, render_template, request, session, send_from_directory
from email.mime.text import MIMEText
from subprocess import Popen, PIPE
import json
import random
from queries.neo4j import graphdb
from queries.sql import sqldb
import time
import unicodedata
from forms import ContactForm
import cPickle as pickle

app = Flask(__name__)
app.debug = False
app.secret_key = 'development key' #Will be changed in production


def sanitize(value): #Quick hack until the database is sanitized
  if type(value)==unicode:
    return unicodedata.normalize('NFKD',value.replace(u'\xc3\xbc','ue')).encode('ascii', 'ignore') #Manually put "ue" in u-umlaut...Need to use a better solution eventually
  return value

@app.route('/robots.txt')
def static_from_root():
    return send_from_directory(app.static_folder, request.path[1:])

@app.route('/')
def home():
  return render_template('home.html')

@app.route('/cv/')
def cv():
  return render_template('cv.html')

@app.route('/contact/',methods=['get','post'])
def contact():
  form = ContactForm()

  if request.method == 'POST':
    if not form.validate():
      return render_template('contact.html', form=form)
    else:
      if not form.antispam.data:
        #We will only email if the bot trap is not checked
        msg = MIMEText("%s" % (form.message.data,))
        msg["From"] = "contact_form"
        msg["To"] = "vsudilovsky@gmail.com"
        msg["Subject"] = "[vsudilovsky.com] (%s:%s): %s" % (form.name.data,form.email.data,form.subject.data,)
        p = Popen(["/usr/sbin/sendmail", "-toi"], stdin=PIPE)
        p.communicate(msg.as_string())
      return render_template('contact_success.html')
 
  elif request.method == 'GET':
    return render_template('contact.html', form=form)
  
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
  app.debug = True
  app.run(host='0.0.0.0')
