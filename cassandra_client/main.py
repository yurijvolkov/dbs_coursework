import os
import time
import logging

from cassandra.cluster import Cluster

logger = logging.getLogger(__name__)

cluster = Cluster([os.getenv('CASSANDRA_HOST')])
session = cluster.connect()
