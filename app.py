from flask import Flask, render_template, request

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
  
  return render_template('projects/parxiv.html')

if __name__ == '__main__':
  app.run(host='0.0.0.0')