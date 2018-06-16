from csv import DictWriter
from random import randint, choice


N_NODES = 1500000
N_ROUTES = 600_000
INSERTS_PER_TRANSOCACTION = 10000

def generate_nodes():
    nodes = []
    used_coords = set()
    for i in range(N_NODES):
        nodes.append({'id': i, 'lon': randint(0, 60000),
                      'lat': randint(0, 60000)})

    return nodes

def generate_connections(nodes):
    transport = ['bus-21a', 'bus-1', 'tram-6']
    suitable_for_cars = ['TRUE', 'FALSE']
    connections = []
    step = 10
    for i in range(N_NODES - step):
        connections.append({
            'fromNodeID': i, 
            'toNodeID': randint(1, step),
            'transport': choice(transport),
            'suitable_for_cars': choice(suitable_for_cars),
            'length': (nodes[i]['lon'] - nodes[i + step]['lon'])**2 +\
                    (nodes[i]['lat'] - nodes[i + step]['lat'])**2,
        })

    step = 50
    for i in range(0, N_NODES - step, step):
        connections.append({
            'fromNodeID': i, 
            'toNodeID': randint(1, 20),
            'transport': choice(transport),
            'suitable_for_cars': choice(suitable_for_cars),
            'length': (nodes[i]['lon'] - nodes[i + 20]['lon'])**2 +\
                    (nodes[i]['lat'] - nodes[i + 20]['lat'])**2,
        })
        connections.append({
            'fromNodeID': i, 
            'toNodeID': randint(1, 40),
            'transport': choice(transport),
            'suitable_for_cars': choice(suitable_for_cars),
            'length': (nodes[i]['lon'] - nodes[i + 40]['lon'])**2 +\
                    (nodes[i]['lat'] - nodes[i + 40]['lat'])**2,
        })

    return connections


def write2csv(filename, obj):
    with open(filename, "w+") as fp:
        writer = DictWriter(fp, fieldnames=list(obj[0].keys()))
        writer.writeheader()
        for o in obj:
            writer.writerow(o)


if __name__ == '__main__':
    nodes = generate_nodes()
    connections = generate_connections(nodes)
    print("done generating")

    write2csv("nodes.csv", nodes)
    write2csv("routes.csv", connections)

