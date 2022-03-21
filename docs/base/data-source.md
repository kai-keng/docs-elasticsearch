# 数据源接入

ES 常见应用场景：日志搜索、业务数据搜索。

日志搜索的数据源接入，由于都是新增行为，不涉及更新和删除，处理相对简单，使用 filebeat 或者 logstash 都可以。一些第三方日志组件也具备接入 ES 的能力，另外像 k8s 这样的平台自身具备日志收集能力，傻瓜式接入即可。

业务数据的同步相对复杂，特别是应对删除操作。现有的方案包括：

1. logstash 定时轮询数据库表数据

这个很好理解，JDBC 插件连接 DB，定时查询数据导到 ES 中，这里有些优化手段，根据记录更新时间，只同步上一次查询之后的数据。定时轮询简单粗暴，可以很好的处理新增及更新（），没法处理

2. 监听数据库操作行为日志 (CDC: Change Data Capture)

3. 订阅业务事件


除了基本的数据同步外，实际在生产中不可避免的需要未知错误兜底方案，即特定或全量数据的强制同步问题。

## 标准输入输入(stdio)

## MongoDB 数据源

## MySQL 数据源

## 参考

1. [如何使用 Logstash 和 JDBC 确保 Elasticsearch 与关系型数据库保持同步](https://www.elastic.co/cn/blog/how-to-keep-elasticsearch-synchronized-with-a-relational-database-using-logstash)
2. [DB与ES混合应用之数据实时同步](https://www.jianshu.com/p/dfed43739f23)