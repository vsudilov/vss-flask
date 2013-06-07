stage { 'first': before  => Stage['main'] }
stage { 'last':  require => Stage['main'] }
stage { 'pre': before => Stage['first'] }

class {
      'apt_update':     stage => pre;
      'system':         stage => first;     
      'python_modules': stage => main;
      'ruby_modules':   stage => main;
      'bootstrap_js':    stage => main;
      'jquery':         stage => main;
      'sass-watch':	stage => last;
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
  }


}

#bootstrap.js via .zip file on github
#------------------------------
class bootstrap_js {
  exec{
    "download_bootstrap":
      command => "/usr/bin/wget http://twitter.github.io/bootstrap/assets/bootstrap.zip -O /home/vagrant/bootstrap.zip",
      user => vagrant,
      creates => "/home/vagrant/bootstrap.zip";
  }
  exec {
    "unzip_and_move":
      command => "/usr/bin/unzip /home/vagrant/bootstrap.zip && /bin/mv /home/vagrant/bootstrap /home/vagrant/webvss2/static/",
      user => vagrant,
      creates => "/home/vagrant/webvss2/static/bootstrap",
      require => Exec["download_bootstrap"];
  }
}


#jquery2.0.2
#------------------------------
class jquery {
  exec {
    "download_jquery":
      command => "/usr/bin/wget http://code.jquery.com/jquery-2.0.2.min.js -O /home/vagrant/webvss2/static/js/jquery-2.0.2.min.js",
      creates => "/home/vagrant/webvss2/static/js/jquery-2.0.2.min.js";
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
      "uwsgi":
          ensure => installed,
          provider => pip;
  }
}



# Ruby packages via gem
#------------------------------
class ruby_modules{
  package{
    "sass":
      ensure => installed,
      provider => gem;
  }
}

class sass-watch{
  exec {
   "sass-watch":
     command => "/usr/local/bin/sass --watch /home/vagrant/webvss2/static/css/sass/style.scss:/home/vagrant/webvss2/static/css/style.css >/dev/null &",
     user => vagrant;
       }
}