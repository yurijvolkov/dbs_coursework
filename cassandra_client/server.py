import os
import logging
import json
from http import HTTPStatus
from flask import Flask, request
from flask_restful import Resource, Api, abort
from werkzeug.contrib.fixers import ProxyFix
from domain_models import PathModel
from cassandra.cqlengine import connection
from cassandra.cqlengine.management import sync_table
from cassandra_wrapper import PathEndpoints


logger = logging.getLogger(__name__)
app = Flask(__name__)
api = Api(app)

class Paths(Resource):

    def get(self):
        if 'path_id' in request.args:
            try:
                models = PathEndpoints.get_path(PathModel,
                                            request.args['path_id'])
                if models.count() == 0:
                    abort(HTTPStatus.NO_CONTENT.value, 
                          message='No data found.')

                return {'nodes': list(map(lambda x: x.node_id, models)),
                        'path_name': models.first().path_name}
            except:
                abort(HTTPStatus.BAD_REQUEST.value, 
                      message='Error while selecting path.' 
                              'Maybe path_id is incorrect?')
        elif 'path_name' in request.args:
            try:
                path_id = PathEndpoints.get_path_id(PathModel,
                                                    request.args['path_name'])
                return {'path_id': str(path_id.path_id)}
            except:
                abort(HTTPStatus.BAD_REQUEST, 
                      message='Error while selecting path_id.'
                               'Maybe path_name is incorrect?')
        else:
            raise abort(HTTPStatus.BAD_REQUEST, 
                        message='Nor path_name, nor path_id specified.')

    def post(self):
        data = json.loads(request.get_json())
        path_name = data['name']
        nodes = data['nodes']

        path_id = PathEndpoints.create_path(PathModel, path_name, nodes)

        return {'path_id': str(path_id)}

api.add_resource(Paths, '/paths')
connection.setup(['cassandra'], 'navigator', protocol_version=3)
sync_table(PathModel)

app.wsgi_app = ProxyFix(app.wsgi_app)

