''' Creates some nodes and connetions between them in neo4j. '''

from collections import namedtuple
from random import randint, choice
import json

from neo4j.v1 import GraphDatabase

from routes import create_route

N_NODES = 1000000
N_ROUTES = 600000
INSERTS_PER_TRANSOCACTION = 100
NODES_FILE = "nodes.json"

Coordinates = namedtuple('Coordinates', ['lon', 'lat'])
Node = namedtuple('Node', ['id', 'coordinates'])

driver = GraphDatabase.driver("bolt://localhost:9687",
                              auth=("neo4j", "1"))

def add_friends(tx, name, friend_name):
    tx.run("MERGE (a:Person {name: $name}) "
           "MERGE (a)-[:KNOWS]->(friend:Person {name: $friend_name})",
           name=name, friend_name=friend_name)


def add_building(tx, coordinates):
    return tx.run("CREATE (n:Building {lon: $lon, lat: $lat}) RETURN ID(n)",
                  lon=coordinates.lon, lat=coordinates.lat)


def fill_buildings():
    used_coordinates = set()
    with driver.session() as session:
        # add to db nodes in transactions
        for _ in range(int(N_NODES / INSERTS_PER_TRANSOCACTION)):
            with session.begin_transaction() as tx:
                for _ in range(INSERTS_PER_TRANSOCACTION):
                    # get unique coordinates for the building
                    c = Coordinates(randint(0, 60000), randint(0, 60000))
                    while c in used_coordinates:
                        c = Coordinates(randint(0, 60000), randint(0, 60000))
                    used_coordinates.add(c)

                    id = add_building(tx, c).single().values()[0]


def fill_routes():
    with driver.session() as session:
        for base_id in range(1, N_NODES, INSERTS_PER_TRANSOCACTION):
            with session.begin_transaction() as tx:
                buses = ['', '24', '22a', '1']
                car   = ['TRUE', 'FALSE']
                for offset in range(INSERTS_PER_TRANSOCACTION):
                    i = base_id + offset
                    res = create_route(tx, i, i + randint(1, 100),
                            choice(buses), choice(car))
            print("commited transaction")


if __name__ == "__main__":
    fill_routes()
