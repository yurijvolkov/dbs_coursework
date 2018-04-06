from cassandra.cqlengine import columns
from cassandra.cqlengine import connection
from cassandra.cqlengine.management import sync_table
from cassandra.cqlengine.models import Model

class PathModel(Model):
    path_id = columns.UUID(primary_key=True)
    order = columns.Integer(primary_key=True)
    path_name = columns.Text(required=True)
    node_id = columns.Integer(required=True)

if __name__ == "__main__":
    connection.setup(['cassandra'], 'navigator', protocol_version=3)
    sync_table(PathModel)

