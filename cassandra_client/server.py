import os
import logging
import json
from flask import Flask, request
from flask_restful import Resource, Api
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
        return "Get Paths"
    def post(self):
        data = json.loads(request.get_json())
        path_name = data['name']
        nodes = data['nodes']

        PathEndpoints.create_path(PathModel, path_name, nodes)
        return 'OK'


connection.setup(['cassandra'], 'navigator', protocol_version=3)
sync_table(PathModel)

api.add_resource(Paths, '/paths')
app.wsgi_app = ProxyFix(app.wsgi_app)

