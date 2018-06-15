#!/bin/bash


docker cp rs.js mongo1:/etc/sdb-cluster-config.js
docker exec mongo1 sh -c 'mongo < /etc/sdb-cluster-config.js'
