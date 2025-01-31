FROM prom/prometheus:latest

WORKDIR /etc/prometheus
COPY prometheus.yml .

CMD [ "/bin/prometheus", \
      "--config.file=/etc/prometheus/prometheus.yml", \
      "--storage.tsdb.path=/prometheus", \
      "--storage.tsdb.retention.time=7d", \
      "--storage.tsdb.retention.size=2.5GB" ]
