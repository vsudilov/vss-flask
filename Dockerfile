FROM ubuntu:precise

RUN apt-get update
RUN apt-get install --upgrade -y python-pip wget build-essential unzip python-dev nginx curl vim
RUN pip install -U supervisor pip gunicorn

COPY . /app
WORKDIR /app

RUN ln -sf /app/manifests/nginx.conf /etc/nginx/nginx.conf
RUN ln -sf /app/manifests/vss_flask.nginx.conf /etc/nginx/sites-enabled/vss.conf
RUN wget http://d3js.org/d3.v3.min.js -O static/js/d3.v3.min.js
RUN wget http://code.jquery.com/jquery-2.0.2.min.js -O static/js/jquery-2.0.2.min.js
RUN wget https://github.com/twbs/bootstrap/releases/download/v3.1.1/bootstrap-3.1.1-dist.zip -O bootstrap.zip
RUN unzip -d static/ bootstrap.zip

RUN pip install -r requirements.txt

EXPOSE 80

CMD ["/usr/local/bin/supervisord", "-c", "/app/manifests/supervisord.conf"]