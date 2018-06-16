from collections import namedtuple
from random import randint, choice
import json

from neo4j.v1 import GraphDatabase


N_NODES = 1000000
N_ROUTES = 600000
INSERTS_PER_TRANSOCACTION = 100
NODES_FILE = "nodes.json"

Coordinates = namedtuple('Coordinates', ['lon', 'lat'])
Node = namedtuple('Node', ['id', 'coordinates'])

driver = GraphDatabase.driver("bolt://localhost:7687",
                              auth=("neo4j", "password"))


# ids in mongo
node_from = "67"
node_to   = "36"

with driver.session() as session:
    with session.begin_transaction() as tx:
        res = tx.run("MATCH (b1:Building), (b2:Building), p=shortestPath((b1)-[*]-(b2))"
                    " WHERE b1.id=$node_from and b2.id=$node_to"
                    " RETURN (p)", node_from=node_from, node_to=node_to)

for records in res.values()[0]:
    for record in records:
        print(record)
