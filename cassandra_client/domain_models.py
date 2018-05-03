from cassandra.cqlengine import columns
from cassandra.cqlengine import connection
from cassandra.cqlengine.management import sync_table
from cassandra.cqlengine.models import Model

class PathModel(Model):
    path_id = columns.UUID(primary_key=True)
    order = columns.Integer(primary_key=True)
    path_name = columns.Text(required=True, index=True)
    node_id = columns.Integer(required=True)

class StatModel(Model):
    path_id = columns.UUID(primary_key=True)
    len = columns.Integer(required=True)
    duration = columns.Integer(required=True)

class VisitedModel(Model):
    path_id = columns.UUID(primary_key=True)
    user_id = columns.UUID(primary_key=True)

if __name__ == "__main__":
    connection.setup(['cassandra1'], 'navigator', protocol_version=3)
    sync_table(PathModel)
    sync_table(StatModel)
    sync_table(VisitedModel)


