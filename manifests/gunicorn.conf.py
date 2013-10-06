import multiprocessing

bind = "127.0.0.1:8000"
workers = multiprocessing.cpu_count() * 2 + 1
max_requests = 100
preload_app = True
chdir = '/var/www/'
daemon = True
debug = False
errorlog = '/tmp/gunicorn.error.log'
