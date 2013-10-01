from queries.neo4j import graphdb
from queries.sql import sqldb
import cPickle as pickle
import json
import unicodedata

def sanitize(value): #Quick hack until the database is sanitized
  if type(value)==unicode:
    return unicodedata.normalize('NFKD',value.replace(u'\xc3\xbc','ue')).encode('ascii', 'ignore') #Manually put "ue" in u-umlaut...Need to use a better solution eventually
  return value

def main():
  gdb = graphdb("http://localhost:7474/db/data/")
  context = {}

  results, metadata = gdb.get_top_firstauthors_by_papercount(limit=10)
  context.update({'top_by_papercount':json.dumps(results)})
  authors = [sanitize(i[0]) for i in results]
  results = gdb.find_authors_relationships(authors)
  context.update({'relationships_by_papercount':json.dumps(results)})

  results, metadata = gdb.get_top_firstauthors_by_citationcount(limit=10)
  context.update({'top_by_citationcount':json.dumps(results)})
  authors = [sanitize(i[0]) for i in results]
  results = gdb.find_authors_relationships(authors)
  context.update({'relationships_by_citationcount':json.dumps(results)})

  results, metadata = gdb.get_top_firstauthors_by_citationsperpaper(limit=10)
  context.update({'top_by_citationsperpaper':json.dumps(results)})
  authors = [sanitize(i[0]) for i in results]
  results = gdb.find_authors_relationships(authors)
  context.update({'relationships_by_citationsperpaper':json.dumps(results)})

  with open('neo4j.cached','w') as f:
    pickle.dump(context,f) 

if __name__ == '__main__':
  main()