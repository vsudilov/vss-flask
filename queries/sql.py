import sqlite3

class sqldb:
  def __init__(self,name='parxiv.db'):
    self.db = sqlite3.connect(name)

  def hist(self,tablename):
    SQL = '''
      SELECT word, sum(count)
      FROM %s
      GROUP BY word
      ORDER BY sum(count) DESC
      LIMIT 50;
    '''
    SQL = SQL.strip()
    SQL = SQL % tablename
    results = self.db.execute(SQL).fetchall()
    return results