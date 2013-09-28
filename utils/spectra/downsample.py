import os,sys
from scipy import signal
from matplotlib import pyplot as plt
import math

def main():
  X,Y = [],[]
  Y2 = []
  index = 0
  with open(sys.argv[1],'r') as fp:
    lines = [i.strip().split() for i in fp.readlines() if i]
  for line in lines:
    y = float(line[1])
    x = index
    index += 1
    Y.append(y)
    X.append(x)
    if x > 1500 and x < 1700:
      print x,y,y-y*3*math.exp(-(x-1600)**2/1500)
      Y2.append(y-y*3*math.exp(-(x-1600)**2/1500))
    else:
      Y2.append(y)



  y = signal.resample(Y,100)
  y2 = signal.resample(Y2,100)

  y = [i/max(y) for i in y]
  y2 = [i/max(y2) for i in y2]

  with open("%s.resampled" %sys.argv[1], 'w') as fp:
    fp.write('x,y\n')
    fp.write('\n'.join(["%s,%s" % (x,y) for x,y in zip(range(len(y)),y)]))

  with open("%s.resampled.absorber" %sys.argv[1], 'w') as fp:
    fp.write('x,y\n')
    fp.write('\n'.join(["%s,%s" % (x,y) for x,y in zip(range(len(y2)),y2)]))



if __name__ == '__main__':
  main()
