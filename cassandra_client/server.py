import os
import logging
import json
from http import HTTPStatus
from flask import Flask, request
from flask_restful import Resource, Api, abort
from werkzeug.contrib.fixers import ProxyFix
from domain_models import PathModel
from cassandra.cqlengine import connection, ValidationError
from cassandra.cqlengine.management import sync_table
from cassandra.cqlengine.query import LWTException
from cassandra import Unavailable, WriteTimeout
from cassandra_wrapper import PathEndpoints
from json.decoder import JSONDecoderError


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
            except ValueError: 
                abort(HTTPStatus.NO_CONTENT, 
                          message='No data found.')

            except ValidationError as e:
                abort(HTTPStatus.BAD_REQUEST,
                      message='Validation error.'
                              'Maybe parameters are incorrect?')
        elif 'path_name' in request.args:
            try:
                path_id = PathEndpoints.get_path_id(PathModel,
                                                    request.args['path_name'])
                return {'path_id': str(path_id.path_id)}
            except ValueError:
                abort(HTTPStatus.BAD_REQUEST, 
                      message='Error while selecting path_id.'
                               'Maybe path_name is incorrect?')
            except ValidationError as e:
                abort(HTTPStatus.BAD_REQUEST,
                      message='Validation error.'
                              'Maybe parameters are incorrect?')
        else:
            abort(HTTPStatus.BAD_REQUEST, 
                  message='Nor path_name, nor path_id specified.')


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
        except JSONDecoderError:
            abort(HTTPStatus.BAD_REQUEST,
                  message='Data is incorrect.')


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


api.add_resource(Paths, '/paths')
connection.setup(['cassandra'], 'navigator', protocol_version=3)
sync_table(PathModel)

app.wsgi_app = ProxyFix(app.wsgi_app)

