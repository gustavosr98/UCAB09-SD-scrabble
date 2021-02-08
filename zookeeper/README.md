# Run Zookeeper Server

Inside this folder run inside a terminal the following command

```
docker-compose up
```

# Zookeeper Server UI

```
docker run \
 -d \
 -p 9000:9000 \
 -e HTTP_PORT=9000 \
 --name zoonavigator \
 --restart unless-stopped \
 elkozmon/zoonavigator:latest
```
