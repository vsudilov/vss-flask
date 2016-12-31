#bind = "unix:/tmp/gunicorn.sock"
bind = "0.0.0.0:8081"
workers = 4
max_requests = 2000
preload_app = True
daemon = False
debug = False
errorlog = '/tmp/gunicorn.error.log'
