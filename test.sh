python redundancy_demo.py 0 TestName
docker kill docker_cassandra1_1
docker kill docker_cassandra2_1

python redundancy_demo.py 1 TestName
