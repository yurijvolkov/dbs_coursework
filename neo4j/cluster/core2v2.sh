docker run --name=core2 --network=cluster \
    --publish=8474:7474 --publish=8473:7473 --publish=8687:7688 \
    --env=NEO4J_dbms_mode=CORE \
    --env=NEO4J_causal__clustering_expected__core__cluster__size=3 \
    --env=NEO4J_causal__clustering_initial__discovery__members=core1:5000,core2:5000,core3:5000 \
    --env=NEO4J_ACCEPT_LICENSE_AGREEMENT=yes \
    core-image
