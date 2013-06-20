import xlrd
import time
from py2neo import neo4j, node, rel, cypher

def main(input='/home/vagrant/webvss2/telbib-output.xlsx'):
  print "Reading in the excel document"
  start = time.time()
  wb = xlrd.open_workbook(input)
  print "...done in %0.1f seconds" % (time.time()-start)
  ws = wb.sheet_by_index(0)
  header = ws.row(0)
  #header --->
  #BibCode,CitationCount,PubYear,Author,AuthorRank,Journal,Telescope,Affiliation,Title,Abstract

  #Get indicies of Nodes
  db = neo4j.GraphDatabaseService("http://localhost:7474/db/data/")
  id_person = db.get_or_create_index(neo4j.Node, "Person")
  id_institute = db.get_or_create_index(neo4j.Node, "Institute")
  id_paper = db.get_or_create_index(neo4j.Node, "Paper")
  id_telescope = db.get_or_create_index(neo4j.Node, "Telescope")
  id_journal = db.get_or_create_index(neo4j.Node, "Journal")

  #Iterate over the excel datasheet, setting up the nodes/relationships
  for i in range(ws.nrows-1):
    loadvalue = float(i)/ws.nrows*100.0
    if not round(loadvalue) % 10:
      print "Loading: %0.1f%%" % (loadvalue)
    row = ws.row(i+1)
    BibCode,CitationCount,PubYear,Author,AuthorRank,Journal,Telescope,Affiliation,Title,Abstract = [i.value for i in row]
    #Person node
    _Person = id_person.get_or_create('name',Author,{'name':Author})
    
    #Institute node
    _Institute = id_institute.get_or_create('name',Affiliation,{'name':Affiliation})
    
    #Paper node
    properties = {'title':Title,
                  'abstract':Abstract,
                  'citationcount':CitationCount,
                  'bibcode':BibCode,
                  'pubyear':PubYear,
                  }
    _Paper = id_paper.get_or_create('title',Title,properties)

    #Telescope node
    _Telescope = id_telescope.get_or_create('name',Telescope,{'name':Telescope})

    #Journal node
    _Journal = id_journal.get_or_create('name',Journal,{'name':Journal})
    
    #Nodes defined, now to make their relationships
    _Person.get_or_create_path(("AUTHOR_OF",{'rank':AuthorRank}),_Paper)
    _Person.get_or_create_path(("AFFILIATED_WITH",{'year',PubYear}),_Institute)
    _Paper.get_or_create_path("SUBMITTED_TO",_Journal)
    _Paper.get_or_create_path("FACILITY_USED",_Telescope)

    
if __name__=='__main__':
  main()
