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


class StatEndpoints:

    @staticmethod
    def get_stat(StatModel, path_id):
        stat = StatModel.objects.filter(path_id=path_id).first()
        if stat is None:
            raise ValueError('No data found.')
        return stat

    @staticmethod
    def create_stat(StatModel, PathModel, path_id, len, duration):
        if PathEndpoints.get_path(PathModel, path_id).count() == 0:
            raise ValueError('Path ID not exist.')
        StatModel.create(path_id=path_id,
                         len=len,
                         duration=duration)

    @staticmethod
    def put_stat(StatModel, path_id, len=None, duration=None):
        stat = StatEndpoints.get_stat(StatModel, path_id)
        if len is not None:
            stat.update(len=len)
        if duration is not None:
            stat.update(duration=duration)

    @staticmethod
    def delete_stat(StatModel, path_id):
        stat = StatEndpoints.get_stat(StatModel, path_id)
        stat.delete()

class VisitedEndpoints:

    @staticmethod
    def get_visited_paths(VisitedModel, user_id):
        paths = VisitedModel.objects.allow_filtering().filter(user_id=user_id)
        if paths.count() == 0:
            raise ValueError('No data found.') 
        return paths
    
    @staticmethod
    def create_visited(PathModel, VisitedModel, path_id, user_id):
        if PathEndpoints.get_path(PathModel, path_id).count() == 0:
            raise ValueError('Path ID not exist.')
        VisitedModel.create(path_id=path_id,
                            user_id=user_id)
    
    @staticmethod
    def delete_visited(PathModel, VisitedModel, path_id, user_id):
        if PathEndpoints.get_path(PathModel, path_id).count() == 0:
            raise ValueError('Path ID not exist.')
        visited = ( VisitedModel.objects.filter(user_id=user_id)
                                       .filter(path_id=path_id)
                                       .first() )
        if visited is None:
           raise ValueError('Data not found.')
        visited.delete()

        


