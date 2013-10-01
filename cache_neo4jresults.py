from queries.neo4j import graphdb
from queries.sql import sqldb
import cPickle as pickle
import json
import unicodedata
import sys

def sanitize(value): #Quick hack until the database is sanitized
  if type(value)==unicode:
    return unicodedata.normalize('NFKD',value.replace(u'\xc3\xbc','ue')).encode('ascii', 'ignore') #Manually put "ue" in u-umlaut...Need to use a better solution eventually
  return value

def main():
  gdb = graphdb("http://localhost:7474/db/data/")
  context = {}
  authordata = {}
  authordata['titles'] = {}
  authordata['abstracts'] = {}
  mapping = {
    'titles':gdb.find_author_titlewords,
    'abstracts':gdb.find_author_abstractwords,
    }

  results, metadata = gdb.get_top_firstauthors_by_papercount(limit=10)
  context.update({'top_by_papercount':json.dumps(results)})
  authors = [sanitize(i[0]) for i in results]
  results = gdb.find_authors_relationships(authors)
  context.update({'relationships_by_papercount':json.dumps(results)})
  for author in authors:
    for category in authordata:
      if author not in category:
        results,metadata = mapping[category](author,20)
        authordata[category][author] = [{'text': i[0], 'size': i[1]} for i in results]

  results, metadata = gdb.get_top_firstauthors_by_citationcount(limit=10)
  context.update({'top_by_citationcount':json.dumps(results)})
  authors = [sanitize(i[0]) for i in results]
  results = gdb.find_authors_relationships(authors)
  context.update({'relationships_by_citationcount':json.dumps(results)})
  for author in authors:
    for category in authordata:
      if author not in category:
        results,metadata = mapping[category](author,20)
        authordata[category][author] = [{'text': i[0], 'size': i[1]} for i in results]


  results, metadata = gdb.get_top_firstauthors_by_citationsperpaper(limit=10)
  context.update({'top_by_citationsperpaper':json.dumps(results)})
  authors = [sanitize(i[0]) for i in results]
  results = gdb.find_authors_relationships(authors)
  context.update({'relationships_by_citationsperpaper':json.dumps(results)})
  for author in authors:
    for category in authordata:
      if author not in category:
        results,metadata = mapping[category](author,20)
        authordata[category][author] =[{'text': i[0], 'size': i[1]} for i in results]

  context.update({'authordata':json.dumps(authordata)})


  with open('neo4j.cached','w') as f:
    pickle.dump(context,f) 

if __name__ == '__main__':
  main()