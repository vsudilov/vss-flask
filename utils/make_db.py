import sqlite3
import xlrd
import time

def main(input='/home/vagrant/webvss2/telbib-output.xlsx',output='telbib.db3'):
  print "Reading in the excel document"
  start = time.time()
  wb = xlrd.open_workbook(input)
  print "...done in %0.1f seconds" % (time.time()-start)
  ws = wb.sheet_by_index(0)
  header = ws.row(0)
  for i in range(ws.nrows-1):
    row = ws.row(i+1)

if __name__=='__main__":
  main()