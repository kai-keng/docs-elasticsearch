# 概念

## 索引

基础配置项：

- mapping: 逻辑上 定义文档的字段名及字段类型，类似 schema 定义
- shard: 物理上 索引的数据分散到 Shard 上，类似数据库分片
- type: 7.0 后一个索引只能创建一个 Type: _doc

倒排索引：

- 单词词典（Term Dictionary）：从文档中拆分出来的单词及其于倒排列表的关联关系
- 倒排列表（Posting List）：单词对应在文档中的信息，其包含的倒排索引项如下：
  - 文档ID
  - 词频：单词在文档出现的次数，用于相关性算分
  - 位置：单词在文档中分词的位置，用于语句搜索
  - 偏移：单词出现的开始结束位置

文档基本结构：

```
_index
_type
_id
_source
_version
_score
```

## 集群

#### 节点 Node

一个节点实际即一个运行 ElasticSearch 的实例

- Master-eligible Node： Master-eligible 节点有权限参与 master 节点选举，只有master节点可修改集群状态

 > 集群状态信息包括:
    - 节点信息
    - 索引的 Mapping 及 Setting 信息
    - Shard 分片路由信息
        
- Data Node: 保存分片数据
- Coordinating Node: 接受请求，分发至节点处理，聚合结果，默认每个节点都具备 Coordinating Node 职责
- Hot & Warm Node: 冷热节点，新数据 Date Node 机器配置较好(Hot Node)，旧数据 不经常用的数据配置性能较差的机器(Warm Node)

通常生产环境一个节点只分配一个角色


#### 分片 Shard

一个分片实际即为一个运行 Lucene 的实例

- 主分片（Primary Shard）：解决数据水平拓展问题，通过主分片将数据分布到集群中的所有节点上，主分片数是创建索引时指定，修改需要 Reindex
- 副本（Replica Shard）：解决数据高可用问题，为主分片的拷贝，副本分片数可动态调整

```
{
    "setting": {
        "index": {
            "number_of_shards": 3,      // 分片数
            "number_of_replicas": 1,    // 分片副本数
        }     
    }
}
```

集群健康状态

- Green: 主分片及副本均正常
- Yellow: 主分片正常，有副本分片未正常分配
- Red：有主分片未能分配


## 文档 CRUD

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

## 分词 Analysis

elasticSearch 分词器 Analyzer，分为三部分：

- Character Filters: 原始文本处理，如去除 html 标签
- Tokenizer: 按规则切分单词
- Token Filter: 处理切分出来的单词，如大写转小写

常用中文分词器：[elasticsearch-analysis-ik](https://github.com/medcl/elasticsearch-analysis-ik)：支持自定义词库及热更新词库

```
# 内置标准分词器
GET /_analyze
{
  "analyzer": "standard", 
  "text": "hello world"
}

# 中文插件分词器
GET /_analyze
{
  "analyzer": "ik_smart", 
  "text": "朝闻国盛：2019年度医药行业研究策略报告"
}
```

## Mapping 设置

Mapping: 类似于 schema，其定义了索引中字段的名称 / 数据类型 / 倒排索引配置

- Mapping 将 JSON 文档映射为 Lucene 中的偏平格式
- 一个文档只属于一个索引 Type，7.0 无需为 Mapping 设置 Type

#### 数据类型

- Text / Keyword
- Integer / Float
- Date
- IPV4 / IPV6
- Object
- 其他：geo_point ...

#### Dynamic Mappings

写入文档时，elasticsearch 可自根据 json 格式自动创建索引，推算 Mapping 类型

对于`新增字段`：

- Dynamic: true  文档写入成功，自动更新 Mapping；
- Dynamic: false 文档写入成功，Mapping 不更新，字段无法被用于索引，但可在 _source 中找到相关信息；
- Dynamic: strict 文档写入失败；

对于`现有字段`：Mapping 字段不可修改，只能通过 reindex 重建索引

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