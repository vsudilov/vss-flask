FROM ubuntu:16.04

RUN apt-get update
RUN apt-get install --upgrade -y python-pip wget build-essential unzip python-dev nginx curl
RUN pip install -U supervisor pip gunicorn

RUN wget http://d3js.org/d3.v3.min.js -O /tmp/d3.v3.min.js
RUN wget https://code.jquery.com/jquery-3.1.1.min.js -O /tmp/jquery-3.1.1.min.js
RUN wget https://github.com/twbs/bootstrap/releases/download/v3.3.7/bootstrap-3.3.7-dist.zip -O /tmp/bootstrap.zip

COPY . /app
WORKDIR /app

RUN ln -sf /app/manifests/nginx.conf /etc/nginx/nginx.conf
RUN ln -sf /app/manifests/vss_flask.nginx.conf /etc/nginx/sites-enabled/vss.conf
RUN ln -sf /tmp/d3.v3.min.js static/js/d3.v3.min.js
RUN ln -sf /tmp/jquery-3.1.1.min.js static/js/jquery-3.1.1.min.js
RUN unzip -o -d static/ /tmp/bootstrap.zip

RUN pip install -r requirements.txt

EXPOSE 80

CMD ["/usr/local/bin/supervisord", "-c", "/app/manifests/supervisord.conf"]
