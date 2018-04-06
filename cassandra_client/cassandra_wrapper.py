import uuid
from cassandra.cqlengine.query import BatchQuery

class PathEndpoints:
    
    @staticmethod
    def create_path(PathModel, path_name, nodes):
        path_id = uuid.uuid1()
        b = BatchQuery()
        for order, node in enumerate(nodes):
            PathModel.batch(b).create(path_id=path_id, 
                             order=order,
                             path_name=path_name,
                             node_id=node)
        b.execute()

