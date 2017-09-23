class LephSpecData:
  #Parses a single .spec file, storing data and metadata
  def __init__(self,f):
    self.filename = f
    with open(self.filename,'r') as fp:
      lines = fp.readlines()
    self.header = lines[0:12]
    self.ident,self.zspec,self.zphot = lines[1].strip().split()
    self.filters = int(lines[3].strip().split()[1])
    self.pdz = int(lines[5].strip().split()[1])
    specTypes = [
      ('GAL-1',7),
      ('GAL-2',8),
      ('GAL-FIR',9),
      ('GAL-STOCH',10),
      ('QSO',11),
      ('STAR',12),
      ]
    cols = [
      'type',
      'nline',
      'model',
      'library',
      'nband',
      'zphot',
      'zinf',
      'zsup',
      'chi2',
      'pdf',
      'extlaw',
      'eb_v',
      'lir',
      'age',
      'mass',
      'sfr',
      'ssfr',
    ]
    self.solutions = {}
    
    offset = 12+self.filters
    for (specType,lineNo) in specTypes:
      parsed = lines[lineNo].strip().split()
      self.solutions[specType] = {}
      self.solutions[specType] = dict( [(col,v) for col,v in zip(cols,parsed)] )
      end = offset+int(self.solutions[specType]['nline'])
      self.solutions[specType]['data'] = {}
      self.solutions[specType]['data']['x'] = [float(i.strip().split()[0]) for i in lines[offset:end]]
      self.solutions[specType]['data']['y'] = [float(i.strip().split()[1]) for i in lines[offset:end]]
      offset += end
      
    self.input_mags = []
    for i in [j+12 for j in range(self.filters)]:
      self.input_mags.append(lines[i].strip().split()[0:2]) #Take just mag,mag_err      
    
#   @classmethod
#   def parse_from_file(cls,f):
#     c = cls(f)
#     c.parse()
#     return c
  