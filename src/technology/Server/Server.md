# 服务器

> ubuntu 系统

## 登陆远程服务器

```sh
ssh <username>@<ip-address>
```

## docker
### 安装
[https://docs.docker.com/engine/install/ubuntu](https://docs.docker.com/engine/install/ubuntu)

### nginx

#### 安装

```sh
sudo docker pull nginx:alpine
```
创建一个 nginx 目录，后面的操作都在nginx目录中进行

#### docker-compose.yml

新建一个 docker-compose 配置文件

```
version: "3"
services:
  nginx:
    image: nginx:alpine
    ports:
      - 80:80
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./log:/var/log/nginx
```
创建 `nginx.conf` 文件和`log` 目录用来挂载 `nginx` 配置和日志

#### 配置文件
先把默认的配置写进去 `nginx.conf`
```sh
 events {
   worker_connections  1024;
 }

 http {
     server {
         listen       80;
         listen  [::]:80;
         server_name  localhost;

         #access_log  /var/log/nginx/host.access.log  main;

         location / {
         root   /usr/share/nginx/html;
         index  index.html index.htm;
         }

         #error_page              /404.html;

         # redirect server error pages to the static page /50x.html
         #
         error_page  502 503 504  /50x.html;
         location = /50x.html {
         root   /usr/share/nginx/html;
         }

    }
}
```

#### 启动

```
docker compose up
```

现在访问你的服务器，应该可以看到 nginx 的默认页面。

