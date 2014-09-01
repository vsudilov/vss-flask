stage { 'first': before  => Stage['main'] }
stage { 'last':  require => Stage['main'] }
stage { 'pre': before => Stage['first'] }

class {
      'apt_update':     stage => pre;
      'system':         stage => first;
#      'neo4j':          stage => main;
      'python_modules': stage => main;
      'bootstrap_js':    stage => main;
      'jquery':         stage => main;
      'd3js':           stage => main;
      'run_webserver':   stage => last;
}

# Run apt-get update once on VM creation
# -----------------------------
class apt_update { 
  exec {
     "apt-get update":
        command => "/usr/bin/apt-get update && touch /root/apt-updated",
        creates => "/root/apt-updated";
       }
}

# System packages via apt
#------------------------------
class system{
  package {
      "build-essential":
          ensure => installed,
          provider => apt;
      "unzip":
          ensure => installed,
          provider => apt;
      "sqlite3":
          ensure => installed,
          provider => apt;
      "python":
          ensure => installed,
          provider => apt;
      "python-dev":
          ensure => installed,
          provider => apt;
      "python-pip":
          ensure => installed,
          provider => apt;
      "rubygems":
          ensure => installed,
          provider => apt;
      "libpq-dev":
          ensure => installed,
          provider => apt;
      "git":
          ensure => installed,
          provider => apt;
      "nginx":
          ensure => installed,
          provider => apt;
      "python-scipy":
          ensure => installed,
          provider => apt;
      "gunicorn":
          ensure => installed,
          provider => apt;
  }


}

#bootstrap.js via .zip file on github
#------------------------------
class bootstrap_js {
  exec{
    "download_bootstrap":
      command => "/usr/bin/wget https://github.com/twbs/bootstrap/releases/download/v3.1.1/bootstrap-3.1.1-dist.zip -O /home/vagrant/bootstrap.zip",
      user => vagrant,
      creates => "/home/vagrant/bootstrap.zip";
  }
  exec {
    "unzip_and_move":
      cwd => "/home/vagrant/",
      command => "/usr/bin/unzip -d /var/www/static/ /home/vagrant/bootstrap.zip",
      user => root,
      creates => "/var/www/static/bootstrap-3.1.1-dist",
      require => Exec["download_bootstrap"];
  }
}

#jquery2.0.2
#------------------------------
class jquery {
  exec {
    "download_jquery":
      command => "/usr/bin/wget http://code.jquery.com/jquery-2.0.2.min.js -O /var/www/static/js/jquery-2.0.2.min.js",
      creates => "/var/www/static/js/jquery-2.0.2.min.js";
  }
}

#d3.js
#------------------------------
class d3js {
  exec {
    "download_d3":
      command => "/usr/bin/wget http://d3js.org/d3.v3.min.js -O /var/www/static/js/d3.v3.min.js",
      creates => "/var/www/static/js/d3.v3.min.js";
  }
}

class neo4j{
  exec {
    "add_key":
      command => "/usr/bin/wget -O - http://debian.neo4j.org/neotechnology.gpg.key | /usr/bin/apt-key add - && echo 'deb http://debian.neo4j.org/repo stable/' > /etc/apt/sources.list.d/neo4j.list",
      creates => "/etc/apt/sources.list.d/neo4j.list";
  }
  exec {
    "apt_update":
      command => "/usr/bin/apt-get update",
      require => Exec["add_key"];
  }
  exec {
    "apt_install":
      command => "/usr/bin/apt-get install neo4j -y",
      require => Exec["apt_update"],
      timeout => 0;
  }
}

# Python modules via pip
#------------------------------
class python_modules{
  package {
      "numpy":
          ensure => "1.6.1",
          provider => pip;
      "Flask":
          ensure => installed,
          provider => pip;
      "xlrd":
          ensure => installed,
          provider => pip;
      "py2neo":
          ensure => installed,
          provider => pip;
      "flask-wtf":
          ensure => installed,
          provider => pip;
      "flask-mail":
          ensure => installed,
          provider => pip;
      "pygeoip":
          ensure => installed,
          provider => pip;
  }
}

class run_webserver {
  file {'/etc/nginx/nginx.conf':
    source => "/var/www/manifests/nginx.conf",
    owner => root,
    group => root;
  }

  file {'/etc/nginx/sites-enabled/vss_flask.nginx.conf':
    source => "/var/www/manifests/vss_flask.nginx.conf",
    owner => root,
    group => root;
  }

  exec { "restart_nginx":
    command => "/etc/init.d/nginx restart",
    user => root,
    require => File['/etc/nginx/nginx.conf','/etc/nginx/sites-enabled/vss_flask.nginx.conf'];
  }
  exec { "start_gunicorn":
    command => "/usr/bin/gunicorn -c /var/www/manifests/gunicorn.conf.py app:app",
    user => vagrant,
    cwd => "/var/www",
    require => Exec['restart_nginx'];
  }
}