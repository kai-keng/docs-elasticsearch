## 基本使用

## 索引 Index 管理

- 创建索引
```
PUT app/_create
```

## 文档 doc CRUD

#### 单一操作
```
# 创建或更新文档（相当于mongodb upsert）- 无论是否需要值更新 都会删除 重新创建 version 值都会变
POST users/_doc/1
{
  "name": "Mike",
  "age": 2
}

# id 查询
GET users/_doc/1


# 更新文档字段 - 值相同时 不执行更新操作 version 值不变
POST users/_update/1
{
  "doc": {
    "age": 7
  }
}
```

#### 批量操作 _bulk

```
# 批量操作索引文档
POST _bulk
{ "index": { "_index": "users", "_id": 2 } }
{"name": "Tony", "age": 0}
{"delete": { "_index": "movies", "_id": "77889900"}}
```

#### 批量读取 _mget

```
# 批量读取文档 1
GET _mget
{
  "docs": [
     { "_index": "users", "_id": 1 },
     { "_index": "movies", "_id": 1 }
  ]
}

# 批量读取文档 2
GET users/_mget
{
  "ids": [1, 2]
}
```

#### 批量查询 _msearch

```
# 批量查询文档
GET movies/_msearch
{}
{ "query" : { "match_all": {} }, "size": 1 }
{}
{ "query" : { "match_all": {} }, "from": 1, "size": 1 }
```

#### 一些常见错误

- 无法连接：网络故障或集群故障
- 连接无法关闭：网络故障或者节点出错
- 429：集群过于繁忙

## Mapping 设置
```
PUT /users/_doc/1
{
    "name": "Nick",
    "age": 10,
    "created_time": "2020-07-01T00:03:59Z"
}

PUT /users/_mapping
{
  "dynamic": "false"
}

PUT /users/_doc/1
{
    "name": "Nick",
    "age": 10,
    "from": "shanghai china",
    "created_time": "2020-07-01T00:03:59Z"
}

GET /users/_mapping

# 报错 from 字段未建倒排索引 无法查找
GET /users/_search?q=from:china 
```