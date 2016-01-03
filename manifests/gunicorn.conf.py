bind = "unix:/tmp/gunicorn.sock"
workers = 4
max_requests = 2000
preload_app = True
chdir = '/app'
daemon = False
debug = False
errorlog = '/tmp/gunicorn.error.log'
