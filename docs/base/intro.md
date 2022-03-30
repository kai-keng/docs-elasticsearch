# 简介

> You know, for search (and analysis)

[官方 What IS](https://www.elastic.co/cn/what-is/elasticsearch)

Elasticsearch 是一个分布式的搜索及分析引擎，是 Elastic Stack 的核心组件。 Logstash 和 Beats 用于收集数据。Kibana 用于数据查询及可视化。

Elasticsearch 面向所有类型的数据提供近实时的搜索分析能力。包括结构化、非结构化的数据、数值型数据、地理（GEO）数据，Elasticsearch 可以高效的存储及索引。

应用场景：

- 面向 app 或者网站的搜索服务
- 存储分析日志、监控指标、安全事件等数据
- 使用机器学习实时对数据进行自动化建模
- 用于自动化工作流的存储引擎
- 作为地理信息系统，管理、集成、分析地理位置数据
- 作为生物信息搜索工具，存储并处理基因数据

ES 底层基于 [Apache Lucene](https://lucene.apache.org/) 搜索引擎库，数据存储为 `JSON` 格式的文档型数据，通过[倒排索引](https://zh.wikipedia.org/wiki/%E5%80%92%E6%8E%92%E7%B4%A2%E5%BC%95)实现高效的全文搜索。

数据查询方面 ES 支持标准的 RESTful API、自定义的 [Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/8.1/query-dsl.html) 以及 [SQL](https://www.elastic.co/guide/en/elasticsearch/reference/8.1/sql-overview.html) 协议。

关于服务的伸缩与弹性

index 索引作为逻辑分组将数据分到多个物理分片（Shard），冗余存储在多个节点（Node）上。以用于防止单点故障以及可能的数据增长扩容需求，Elasticsearch 会自动迁移分片以重新平衡集群。

ES 的分片（Shard）分为两种类型，primary 主分片以及 replicas 副本分片，主分片的数量在索引创建时就固定了，副本分片可依据需要进行伸缩，不会影响索引及查询等服务。

关于分片大小及主分片的数量配置，需综合考量。分片分的越多，维护索引的开销就越大。分片大小越大，当 Elasticsearch 需要重新平衡集群时，移动分片所需的时间就越长。查询大量小分片会使每个分片的处理速度更快，但更多的查询意味着更多的开销，因此查询较少数量的大分片可能会更快。

官方的建议：

- 旨在将平均分片大小保持在几 GB 到几十 GB 之间。对于具有基于时间的数据的用例，通常会看到 20GB 到 40GB 范围内的分片。
- 避免大量碎片问题。一个节点可以容纳的分片数量与可用的堆空间成正比。作为一般规则，每 GB 堆空间的分片数应小于 20。

关于容灾，为保证连通性，单一集群的节点放在同一数据中心；为保证高可用，可采用跨集群复制（CCR，Cross-cluster replication）的方式将主集群索引数据同步至热备集群，当然热备集群也可以基于地理位置就近面向用户提供只读服务，需要注意的是 CCR 模式，主集群（Leader）处理所有的写操纵，复制节点仅作为 Follower 处理读请求，当主集群出现故障时，可让 follower 集群接管