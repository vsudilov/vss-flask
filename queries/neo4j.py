from py2neo import neo4j, node, rel, cypher
import os,sys

class graphdb:
  def __init__(self,db_url="http://localhost:7474/db/data/"):
    self.db = neo4j.GraphDatabaseService(db_url)
    
  def get_collaborators_case_insensitive(self,author,rank):
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

  def get_collaborators_case_sensitive(self,author,rank):
    QUERY = '''
      START author=node:Person(name="%s")
      MATCH (author)-[:AUTHOR_OF]->(paper)<-[rank:AUTHOR_OF]-(collaboraters)
      WHERE  
        rank.rank<=%s
        AND rank.rank<>1
      RETURN distinct(collaboraters)
    '''.strip()
    QUERY = QUERY % (author,rank)
    results = cypher.execute(self.db,QUERY)
    return results

  def get_top_firstauthors_by_papercount(self,limit):
    QUERY = '''
      START author=node:Person('name:*')
      MATCH (author)-[rank:AUTHOR_OF]->(paper)
      WHERE 
        rank.rank=1
      RETURN author.name,count(paper) 
      ORDER BY count(paper) DESC
      LIMIT %s; 
    '''
    QUERY = QUERY % (limit,)
    results = cypher.execute(self.db,QUERY)
    return results

  def get_top_firstauthors_by_citationcount(self,limit):
    QUERY = '''
      START author=node:Person('name:*')
      MATCH (author)-[rank:AUTHOR_OF]->(paper)
      WHERE 
        rank.rank=1
      RETURN author.name, sum(paper.citationcount) 
      ORDER BY sum(paper.citationcount) DESC
      LIMIT %s;
    '''
    QUERY = QUERY % (limit,)
    results = cypher.execute(self.db,QUERY)
    return results

  def get_top_firstauthors_by_citationsperpaper(self,limit):
    QUERY = '''
      START author=node:Person('name:*')
      MATCH (author)-[rank:AUTHOR_OF]->(paper)
      WHERE 
        rank.rank=1
      RETURN author.name, sum(paper.citationcount)/count(paper) 
      ORDER BY sum(paper.citationcount)/count(paper) DESC
      LIMIT %s;
    '''
    QUERY = QUERY % (limit,)
    results = cypher.execute(self.db,QUERY)
    return results

  def find_authors_relationships(self,authors):
    results = {}
    for author in authors:
      results[author] = {}
      for related_author in authors:
        if related_author == author:
          continue
        QUERY = '''
          START author=node:Person(name="%s")
          MATCH (author)-[fa:AUTHOR_OF]->(paper)<-[rank:AUTHOR_OF]-(related_author)
          WHERE
            related_author.name="%s"
            AND fa.rank=1
          RETURN rank.rank
        '''
        QUERY = QUERY % (author,related_author)
        results[author][related_author] = [i[0] for i in cypher.execute(self.db,QUERY)[0]]
    return results
    #START a=node:Person(name="Greiner, J."), b=node:Person(name="Klose, S.") MATCH p=allShortestPaths(a<-[:AUTHOR_OF*]->b) return relationships(p);

  def find_author_abstractwords(self,author,limit):
    QUERY = '''
      START author=node:Person(name="%s")
      MATCH (author)-[:AUTHOR_OF]->(paper)<-[c:IN_ABSTRACT_OF]-(w)
      RETURN distinct(w.word),sum(c.count)
      ORDER BY sum(c.count) DESC
      LIMIT %s;
    '''
    QUERY = QUERY % (author,limit)
    results = cypher.execute(self.db,QUERY)
    return results


  def find_author_titlewords(self,author,limit):
    QUERY = '''
      START author=node:Person(name="%s")
      MATCH (author)-[:AUTHOR_OF]->(paper)<-[c:IN_TITLE_OF]-(w)
      RETURN distinct(w.word),sum(c.count)
      ORDER BY sum(c.count) DESC
      LIMIT %s;
    '''
    QUERY = QUERY % (author,limit)
    results = cypher.execute(self.db,QUERY)
    return results

  def find_author_affiliations(self,author):
    QUERY = '''
      START author=node:Person(name="%s")
      MATCH (author)-[y:AFFILIATED_WITH]->(institute)
      RETURN distinct(institute)
    '''
    QUERY = QUERY % (author,)
    results = cypher.execute(self.db,QUERY)
    return results
