FROM python:3.6

ADD cassandra_client /cassandra_client

RUN pip install -r cassandra_client/requirements.txt

ENTRYPOINT cd /cassandra_client && gunicorn --bind=0.0.0.0:8045 hello:app
