docker run --name=core1 --detach --network=cluster \
    --publish=7474:7474 --publish=7473:7473 --publish=7687:7687 \
    --env=NEO4J_dbms_mode=CORE \
    --env=NEO4J_causal__clustering_expected__core__cluster__size=3 \
    --env=NEO4J_causal__clustering_initial__discovery__members=core1:5000,core2:5000,core3:5000 \
    --env=NEO4J_ACCEPT_LICENSE_AGREEMENT=yes \
    neo4j:3.3-enterprise
