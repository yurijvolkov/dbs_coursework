import os
import logging
import json
from http import HTTPStatus
from flask import Flask, request
from flask_restful import Resource, Api, abort
from werkzeug.contrib.fixers import ProxyFix
from domain_models import PathModel, StatModel, VisitedModel
from cassandra.cqlengine import connection, ValidationError
from cassandra.cqlengine.management import sync_table
from cassandra.cqlengine.query import LWTException
from cassandra import Unavailable, WriteTimeout
from cassandra_wrapper import PathEndpoints, StatEndpoints, VisitedEndpoints

logger = logging.getLogger(__name__)
app = Flask(__name__)
api = Api(app)

class Paths(Resource):

    def get(self):
        if 'path_id' in request.args:
            try:
                models = PathEndpoints.get_path(PathModel,
                                            request.args['path_id'])
                return {'nodes': list(map(lambda x: x.node_id, models)),
                        'path_name': models.first().path_name}
            except ValidationError as e:
                abort(HTTPStatus.BAD_REQUEST,
                      message='Validation error.'
                              'Maybe parameters are incorrect?')
            except ValueError: 
                abort(HTTPStatus.NO_CONTENT, 
                          message='No data found.')

        elif 'path_name' in request.args:
            try:
                path_id = PathEndpoints.get_path_id(PathModel,
                                                    request.args['path_name'])
                return {'path_id': str(path_id.path_id)}
            except ValidationError as e:
                abort(HTTPStatus.BAD_REQUEST,
                      message='Validation error.'
                              'Maybe parameters are incorrect?')
            except ValueError:
                abort(HTTPStatus.BAD_REQUEST, 
                      message='Error while selecting path_id.'
                               'Maybe path_name is incorrect?')
        else:
            all_ids = PathEndpoints.get_all_paths(PathModel)
            return all_ids


    def post(self):
        data = json.loads(request.get_json())
        
        if ('name' not in data) or ('nodes' not in data):
            abort(HTTPStatus.BAD_REQUEST, message='Not enough params.')

        path_name = data['name']
        nodes = data['nodes']
        
        try:
            path_id = PathEndpoints.create_path(PathModel, path_name, nodes)
            return {'path_id': str(path_id)}
        except Unavailable:
            abort(HTTPStatus.NOT_FOUND,
                  message='Insertion failed. No replicas available.')
        except WriteTimeout:
            abort(HTTPStatus.REQUEST_TIMEOUT,
                  message='Insertion failed. Timeout.')

    def put(self):
        if ('path_id' not in request.args) or ('path_name' not in request.args):
            abort(HTTPStatus.BAD_REQUEST, message='Not enough params.')
        
        try:
            PathEndpoints.put_path(PathModel, 
                                   request.args['path_id'],
                                   request.args['path_name'])
            return 'OK'
        except ValidationError as e:
                abort(HTTPStatus.BAD_REQUEST,
                      message='Validation error.'
                              'Maybe parameters are incorrect?')
        except ValueError:
            abort(HTTPStatus.NO_CONTENT, message='No data found.')


    def delete(self):
        if 'path_id' not in request.args:
            abort(HTTPStatus.BAD_REQUEST, message='Not enough params.') 

        try:
            PathEndpoints.delete_path(PathModel,
                                      request.args['path_id'])
            return 'OK'
        except ValidationError as e:
                abort(HTTPStatus.BAD_REQUEST,
                      message='Validation error.'
                              'Maybe parameters are incorrect?')
        except ValueError:
            abort(HTTPStatus.NO_CONTENT, message='No data found.') 

class Statistics(Resource):
    def get(self):
        if 'path_id' not in request.args:
            abort(HTTPStatus.BAD_REQUEST, message='Not enough params.')
        try:
            statistics = StatEndpoints.get_stat(StatModel, request.args['path_id'])
            return {"len": statistics.len,
                    "duration": statistics.duration}
        except ValidationError as e:
            abort(HTTPStatus.BAD_REQUEST,
                     message='Validation error.'
                     'Maybe parameters are incorrect?')
        except ValueError:
            abort(HTTPStatus.NO_CONTENT, message='No data found.')
           
    def post(self):
        data = json.loads(request.get_json())

        if ('len' not in data) or ('duration' not in data) or ('path_id' not in data):
            abort(HTTPStatus.BAD_REQUEST, message='Not enough params.')

        len = data['len']
        duration = data['duration']
        path_id = data['path_id']

        try:
            StatEndpoints.create_stat(StatModel, PathModel, path_id, len, duration)
        except ValueError:
            abort(HTTPStatus.BAD_REQUEST, message='Incorrect data.')

    def put(self):
        if 'path_id' not in request.args:
            abort(HTTPStatus.BAD_REQUEST, message='Not enough params.')

        try:
            StatEndpoints.put_stat(StatModel,
                                   request.args['path_id'],
                                   request.args['len'] if 'len' in request.args else None,
                                   request.args['duration'] if 'duration' in request.args else None)
        except ValueError:
            abort(HTTPStatus.NO_CONTENT, message='No data found.')

    def delete(self):
        if 'path_id' not in request.args:
            abort(HTTPStatus.BAD_REQUEST, message='Not enough params.')

        try:
            StatEndpoints.delete_stat(StatModel, request.args['path_id'])
        except ValueError: 
            abort(HTTPStatus.NO_CONTENT, message='No data found.')

class Visited(Resource):
    def get(self):
        if 'user_id' not in request.args:
            abort(HTTPStatus.BAD_REQUEST, message='Not enough params.')
        try:
            paths = VisitedEndpoints.get_visited_paths(VisitedModel, 
                                                       request.args['user_id'])
            return {'paths': list(map(lambda x: str(x.path_id), paths))}
        except ValueError:
            abort(HTTPStatus.NO_CONTENT, message='No data found.')
    
    def post(self):
        data = json.loads(request.get_json())

        if ('user_id' not in data) or ('path_id' not in data):
            abort(HTTPStatus.BAD_REQUEST, message='Not enough params.')

        user_id = data['user_id']
        path_id = data['path_id']

        try:
            VisitedEndpoints.create_visited(PathModel, VisitedModel, 
                                            path_id, user_id)
        except ValueError:
            abort(HTTPStatus.BAD_REQUEST, message='Incorrect data.')

    def delete(self):
        if ('path_id' not in request.args) or ('user_id' not in request.args):
            abort(HTTPStatus.BAD_REQUEST, message='Not enough params.')

        try:
            VisitedEndpoints.delete_visited(PathModel, VisitedModel,
                                            request.args['path_id'],
                                            request.args['user_id'])
        except ValueError:
            abort(HTTPStatus.NO_CONTENT, message='No data found.')


api.add_resource(Paths, '/paths')
api.add_resource(Statistics, '/stat')
api.add_resource(Visited, '/visit')
connection.setup(['cassandra1'], 'navigator', protocol_version=3)
sync_table(PathModel)

app.wsgi_app = ProxyFix(app.wsgi_app)

