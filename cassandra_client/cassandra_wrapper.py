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
        return path_id

    @staticmethod
    def get_path(PathModel, path_id):
        paths = PathModel.objects.filter(path_id=path_id)
        if paths.count() == 0:
            raise ValueError('No data found.')
        return paths

    @staticmethod
    def get_path_id(PathModel, path_name):
        path = ( PathModel.objects.filter(path_name=path_name)
                                  .first() )
        if path is None:
            raise ValueError('No data found.')
        return path

    @staticmethod
    def put_path(PathModel, path_id, new_path_name):
        models = PathEndpoints.get_path(PathModel, path_id)
        if models.count() == 0:
            raise ValueError('No such path exists.')
        path = models.all()
        for node in path:
            node.update(path_name=new_path_name)

    @staticmethod
    def delete_path(PathModel, path_id):
        models = PathEndpoints.get_path(PathModel, path_id)
        if models.count() == 0:
            raise ValueError('No such path exists.')
        path = models.all()
        for node in path:
            node.delete()


