#!/bin/bash

CLUSTER_NETWORK_NAME="sdb-cluster"
REPLICA_SET_NAME="sdb-replica-set"
CONTAINER_NAME_PREFIX="mongo"

docker network create $CLUSTER_NETWORK_NAME
for i in {1..3}; do
    docker run \
        --detach=true \
        -p "2701$i":27017 \
        --name "${CONTAINER_NAME_PREFIX}${i}" \
        --net $CLUSTER_NETWORK_NAME \
        mongo mongod --replSet $REPLICA_SET_NAME --bind_ip_all
done
