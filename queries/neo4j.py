from py2neo import neo4j, node, rel, cypher
import os,sys

class graphdb:
  def __init__(self,db_url="http://localhost:7474/db/data/"):
    self.db = neo4j.GraphDatabaseService(db_url)
    
  def get_collaborators(self,author,rank):
    QUERY = '''
      START author=node:Person("name:*")
      MATCH (author)-[:AUTHOR_OF]->(paper)<-[rank:AUTHOR_OF]-(collaboraters)
      WHERE  
        author.name=~"(?i)%s"
        AND rank.rank<=%s
        AND rank.rank<>1
      RETURN distinct(collaboraters)
    '''.strip()
    QUERY = QUERY % (author,rank)
    results = cypher.execute(self.db,QUERY)
    return results