# 概念

## 文档 doc

基本结构：

```
_index: 文档所属索引标识
_type: 文档所属类型 7.0.0 后不再支持多类型，约定值：_doc
_id: 文档ID
_source: 文档原始JSON文件
_version: 文档版本信息
_score: 搜索算分
```

## 索引 Index

> 需要注意的是 ES 环境下讨论的`索引`更多的表示为 SQL 中的 Table 的概念，mapping 对应 SQL 中的表结构定义，doc 意思相近为存储的记录

ES 使用倒排索引：

- 单词词典（Term Dictionary）：从文档中拆分出来的单词及其于倒排列表的关联关系，（由于单词词典数据较大，一般会采用B+数或哈希拉链实现）
- 倒排列表（Posting List）：单词对应在文档中的信息，其包含的倒排索引项如下：
  - 文档ID
  - 词频：单词在文档出现的次数，用于相关性算分
  - 位置：单词在文档中分词的位置，用于语句搜索
  - 偏移：单词出现的开始结束位置

索引相关的基础配置项：

- type: 7.0 后一个索引只能创建一个 Type: _doc
- mapping: 逻辑上，定义文档的字段名及字段类型，类似 schema 定义
- shard: 物理上，索引的数据分散到 Shard 上，类似数据库分片

## Mapping

Mapping: 类似于 schema，其定义了索引中字段的名称 / 数据类型 / 倒排索引配置

- Mapping 将 JSON 文档映射为 Lucene 中的偏平格式
- 一个文档只属于一个索引 Type，7.0 无需为 Mapping 设置 Type

Mapping分为动态、静态两类：

- 动态映射：ES 自动对 doc 的字段进行分词、索引
- 静态映射：手动配置 doc 的字段映射，包括：

```
- 哪些字符串字段应被视为全文字段。
- 哪些字段包含数字、日期或地理位置。
- 日期值的格式。
- 用于控制动态添加字段的映射的自定义规则
```

## 数据类型

- Text / Keyword
- Integer / Float
- Date
- IPV4 / IPV6
- Object
- 其他：geo_point ...

### 动态映射

写入文档时，elasticsearch 可自根据 json 格式自动创建索引，推算 Mapping 类型

对于`新增字段`：

- Dynamic: true  文档写入成功，自动更新 Mapping；
- Dynamic: false 文档写入成功，Mapping 不更新，字段无法被用于索引，但可在 _source 中找到相关信息；
- Dynamic: strict 文档写入失败；

对于`现有字段`：Mapping 字段不可修改，只能通过 reindex 重建索引

### 静态映射


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

## 分词 Analysis

elasticSearch 分词器 Analyzer，分为三部分：

- Character Filters: 原始文本处理，如去除 html 标签
- Tokenizer: 按规则切分单词，如按空格切分
- Token Filter: 处理切分出来的单词，如大写转小写，删除修饰性的词等

分词器实际做在两个阶段：

- 文档索引阶段：对文档进行分词及建立索引
- 搜索阶段：全文检索时，对输入的查询文本进行分词

绝大多数情况两者使用同一套分词器，特定场景也可指定不同的分词器

常用中文分词器：

- [elasticsearch-analysis-ik](https://github.com/medcl/elasticsearch-analysis-ik)：中文分词，支持自定义词库及热更新词库
- [elasticsearch-analysis-pinyin](https://github.com/medcl/elasticsearch-analysis-pinyin)：中文 pinyin 分词

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