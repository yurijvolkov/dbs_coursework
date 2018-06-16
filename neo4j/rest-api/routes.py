from neo4j.v1 import GraphDatabase
import json


def create_route(tx, node_from, node_to, bus, car):
    return tx.run('MATCH (b1:building), (b2:building) \
            where b1.id=$b1_id and b2.id=$b2_id \
            CREATE (b1)-[r:route {bus: $bus, car: toBoolean($car)}]->(b2) RETURN ID(r)',
            b1_id=str(node_from), b2_id=str(node_to), bus=bus, car=car).values()


def get_route_details():
    id_ = request.args.get("id")

    with driver.session() as session:
        with session.begin_transaction() as tx:
            res = tx.run("MATCH (from)-[r]-(to)"
                   "WHERE ID(from)=$id_from AND ID(to)=$id_to"
                   "RETURN r",
                   id_from=node_id_from, id_to=node_id_to)

    return json.dumps({"result": res})


def delete_route():
    id_ = request.args.get("id")
    with driver.session() as session:
        with session.begin_transaction() as tx:
            res = tx.run("MATCH (r:route) WHERE ID(r)=$node_id DELETE(r)",
                    node_id=id_).single()

    return json.dumps({"result": res})


def update_route():
    id_ = request.args.get("id")
    bus = request.args.get("bus")
    car = request.args.get("car")

    with driver.session() as session:
        with session.begin_transaction() as tx:
            res = tx.run("MATCH (r:route) WHERE ID(r)=$id SET r.bus=$bus, r.car=$car",
                    id=id_, bus=bus, car=car)

    return json.dumps({"result": res})
