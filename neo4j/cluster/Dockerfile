FROM neo4j:3.3-enterprise

COPY docker-entrypoint.sh /bin/entry
ENTRYPOINT /sbin/tini -g -- /bin/entry neo4j

