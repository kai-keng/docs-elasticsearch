# 安装

> 自 8.0 起，网络层默认开启 TLS 加密，启动时将由 ES 生成如下加密文件：
> - http_ca.crt: HTTP 层 CA 签名证书
> - http.p12: 作用于服务节点的 HTTP 加密秘钥库
> - transport.p12: 作用于整个集群的传输层加密秘钥库

## Docker 本机单节点安装

- 创建 elastic 网络

```
docker network create elastic
```

- 运行 elasticsearch 服务

```
docker run --name es-node01 --net elastic -p 9200:9200 -p 9300:9300 -it docker.elastic.co/elasticsearch/elasticsearch:8.1.0
```

若未指定配置, ES 在首次启动的时会默认创建 `elastic` 的用户，并为 Kibana 服务创建认证Token，并将相应信息打印在终端上

将 http CA 证书从容器中拷贝出来，并验证 ES 服务是否正常启动

```shell
docker cp es01:/usr/share/elasticsearch/config/certs/http_ca.crt .

curl --cacert http_ca.crt -u elastic https://localhost:9200
```

- 运行 Kibana 服务

`docker run --name kib-01 --net elastic -p 5601:5601 docker.elastic.co/kibana/kibana:8.1.0`

## Docker 环境集群安装

使用 `docker-compose` 部署集群服务

一些生产环境部署时的注意事项：

> [官网文档](https://www.elastic.co/guide/en/elasticsearch/reference/8.1/docker.html#docker-prod-prerequisites)

- `vm.max_map_count` 至少配置为 `262144`
- 注意 mount 文件的访问权限问题，默认 ES 使用 `elasticsearch` 用户，已 gid `0` 启动服务
- 注意 `ulimits` 配置，保证打开的文件数 nofile 及启动的进程数 nproc 足够用
- 性能考虑，禁用 `swapping` [相关说明](https://www.elastic.co/guide/en/elasticsearch/reference/8.1/setup-configuration-memory.html)

