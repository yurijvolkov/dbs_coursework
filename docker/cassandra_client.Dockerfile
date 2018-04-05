FROM python:3.6

ADD cassandra_client /cassandra_client

RUN pip install -r cassandra_client/requirements.txt

ENTRYPOINT python cassandra_client/main.py
