# Nginx load balancer

Inside this folder run inside a terminal the following command

```
docker-compose up
```

# Add other servers

```
upstream backend {
    server 172.17.0.1:${SERVER_PORT};
    server api.second.backend.com:3000;
}
...
```

> By default, this function reads template files in `./templates/*.template` and outputs the result of executing envsubst to `/etc/nginx/conf.d`
