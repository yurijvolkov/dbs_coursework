def create_building(tx, coordinates):
    return tx.run("CREATE (n:Building {lon: $lon, lat: $lat}) RETURN ID(n)",
                  lon=coordinates.lon, lat=coordinates.lat).single().values()[0]


def find_building(tx, id):
    return tx.run("MATCH ((n:Building) ID(n)=$id RETURN n", id=id).single().values()[0]


def delete_building(tx, id):
    tx.run("MATCH (n:Building ID(n) DELETE n")
    return None


def update_building(tx, id, coordinates):
    return tx.run("MATCH (n:Building ID(n)=$id) SET n.lon=$lon, n.lat=$lat",
                  lon=coordinates.lon, lat=coordinates.lat)


def find_path(tx, node_from, node_to):
    return tx.run("MATCH (b1:Building), (b2:Building), p=shortestPath((b1)-[*]-(b2))"
                "WHERE ID(b1)=$node_from and ID(b2)=$node_to"
                "RETURN p", node_from, node_to).single()
