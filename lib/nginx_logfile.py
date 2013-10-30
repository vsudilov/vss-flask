import datetime
import pygeoip
from collections import Counter

class Logfile:
  def __init__(self,logfile='/tmp/nginx.access.log'):
    self.logfile = logfile
    self.IPs = None
    with open(logfile) as f:
      self.lines = [i for i in f.readlines() if i]
    self.startDate = datetime.datetime.strptime(self.lines[0].split()[3],'[%d/%b/%Y:%H:%M:%S')
    self.endDate = datetime.datetime.strptime(self.lines[-1].split()[3],'[%d/%b/%Y:%H:%M:%S')

  def parseIPs(self):
    self.visitors = []
    raw_ips = []
    for line in self.lines:
      raw_ips.append(line.split()[0])
    gi = pygeoip.GeoIP('/usr/share/GeoIP/GeoLiteCity.dat')
    for ip,hits in Counter(raw_ips).iteritems():
      lookup = gi.record_by_addr(ip)
      if not lookup:
        continue
      d = {}
      d['hits'] = hits
      d['latitude'] = lookup['latitude']
      d['longitude'] = lookup['longitude']
      d['city'] = lookup['city']
      self.visitors.append(d)
    self.visitors.sort(key=lambda d: d['hits'],reverse=True)
