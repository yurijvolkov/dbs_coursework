FROM python:3.6

ADD cassandra_client /cassandra_client

RUN pip install -r cassandra_client/requirements.txt

ENTRYPOINT sleep 30 && cd /cassandra_client && gunicorn -t 600 --bind=0.0.0.0:8045 server:app
