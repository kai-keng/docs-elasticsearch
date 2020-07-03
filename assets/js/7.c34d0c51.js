(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{353:function(a,e,s){"use strict";s.r(e);var t=s(42),n=Object(t.a)({},(function(){var a=this,e=a.$createElement,s=a._self._c||e;return s("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[s("h1",{attrs:{id:"概念"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#概念"}},[a._v("#")]),a._v(" 概念")]),a._v(" "),s("h2",{attrs:{id:"索引"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#索引"}},[a._v("#")]),a._v(" 索引")]),a._v(" "),s("p",[a._v("基础配置项：")]),a._v(" "),s("ul",[s("li",[a._v("mapping: 逻辑上 定义文档的字段名及字段类型，类似 schema 定义")]),a._v(" "),s("li",[a._v("shard: 物理上 索引的数据分散到 Shard 上，类似数据库分片")]),a._v(" "),s("li",[a._v("type: 7.0 后一个索引只能创建一个 Type: _doc")])]),a._v(" "),s("p",[a._v("倒排索引：")]),a._v(" "),s("ul",[s("li",[a._v("单词词典（Term Dictionary）：从文档中拆分出来的单词及其于倒排列表的关联关系")]),a._v(" "),s("li",[a._v("倒排列表（Posting List）：单词对应在文档中的信息，其包含的倒排索引项如下：\n"),s("ul",[s("li",[a._v("文档ID")]),a._v(" "),s("li",[a._v("词频：单词在文档出现的次数，用于相关性算分")]),a._v(" "),s("li",[a._v("位置：单词在文档中分词的位置，用于语句搜索")]),a._v(" "),s("li",[a._v("偏移：单词出现的开始结束位置")])])])]),a._v(" "),s("p",[a._v("文档基本结构：")]),a._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[a._v("_index\n_type\n_id\n_source\n_version\n_score\n")])])]),s("h2",{attrs:{id:"集群"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#集群"}},[a._v("#")]),a._v(" 集群")]),a._v(" "),s("h4",{attrs:{id:"节点-node"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#节点-node"}},[a._v("#")]),a._v(" 节点 Node")]),a._v(" "),s("p",[a._v("一个节点实际即一个运行 ElasticSearch 的实例")]),a._v(" "),s("ul",[s("li",[a._v("Master-eligible Node： Master-eligible 节点有权限参与 master 节点选举，只有master节点可修改集群状态")])]),a._v(" "),s("blockquote",[s("p",[a._v("集群状态信息包括:\n- 节点信息\n- 索引的 Mapping 及 Setting 信息\n- Shard 分片路由信息")])]),a._v(" "),s("ul",[s("li",[a._v("Data Node: 保存分片数据")]),a._v(" "),s("li",[a._v("Coordinating Node: 接受请求，分发至节点处理，聚合结果，默认每个节点都具备 Coordinating Node 职责")]),a._v(" "),s("li",[a._v("Hot & Warm Node: 冷热节点，新数据 Date Node 机器配置较好(Hot Node)，旧数据 不经常用的数据配置性能较差的机器(Warm Node)")])]),a._v(" "),s("p",[a._v("通常生产环境一个节点只分配一个角色")]),a._v(" "),s("h4",{attrs:{id:"分片-shard"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#分片-shard"}},[a._v("#")]),a._v(" 分片 Shard")]),a._v(" "),s("p",[a._v("一个分片实际即为一个运行 Lucene 的实例")]),a._v(" "),s("ul",[s("li",[a._v("主分片（Primary Shard）：解决数据水平拓展问题，通过主分片将数据分布到集群中的所有节点上，主分片数是创建索引时指定，修改需要 Reindex")]),a._v(" "),s("li",[a._v("副本（Replica Shard）：解决数据高可用问题，为主分片的拷贝，副本分片数可动态调整")])]),a._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[a._v('{\n    "setting": {\n        "index": {\n            "number_of_shards": 3,      // 分片数\n            "number_of_replicas": 1,    // 分片副本数\n        }     \n    }\n}\n')])])]),s("p",[a._v("集群健康状态")]),a._v(" "),s("ul",[s("li",[a._v("Green: 主分片及副本均正常")]),a._v(" "),s("li",[a._v("Yellow: 主分片正常，有副本分片未正常分配")]),a._v(" "),s("li",[a._v("Red：有主分片未能分配")])]),a._v(" "),s("h2",{attrs:{id:"文档-crud"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#文档-crud"}},[a._v("#")]),a._v(" 文档 CRUD")]),a._v(" "),s("h4",{attrs:{id:"单一操作"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#单一操作"}},[a._v("#")]),a._v(" 单一操作")]),a._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[a._v('# 创建或更新文档（相当于mongodb upsert）- 无论是否需要值更新 都会删除 重新创建 version 值都会变\nPOST users/_doc/1\n{\n  "name": "Mike",\n  "age": 2\n}\n\n# id 查询\nGET users/_doc/1\n\n\n# 更新文档字段 - 值相同时 不执行更新操作 version 值不变\nPOST users/_update/1\n{\n  "doc": {\n    "age": 7\n  }\n}\n')])])]),s("h4",{attrs:{id:"批量操作-bulk"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#批量操作-bulk"}},[a._v("#")]),a._v(" 批量操作 _bulk")]),a._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[a._v('# 批量操作索引文档\nPOST _bulk\n{ "index": { "_index": "users", "_id": 2 } }\n{"name": "Tony", "age": 0}\n{"delete": { "_index": "movies", "_id": "77889900"}}\n')])])]),s("h4",{attrs:{id:"批量读取-mget"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#批量读取-mget"}},[a._v("#")]),a._v(" 批量读取 _mget")]),a._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[a._v('# 批量读取文档 1\nGET _mget\n{\n  "docs": [\n     { "_index": "users", "_id": 1 },\n     { "_index": "movies", "_id": 1 }\n  ]\n}\n\n# 批量读取文档 2\nGET users/_mget\n{\n  "ids": [1, 2]\n}\n')])])]),s("h4",{attrs:{id:"批量查询-msearch"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#批量查询-msearch"}},[a._v("#")]),a._v(" 批量查询 _msearch")]),a._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[a._v('# 批量查询文档\nGET movies/_msearch\n{}\n{ "query" : { "match_all": {} }, "size": 1 }\n{}\n{ "query" : { "match_all": {} }, "from": 1, "size": 1 }\n')])])]),s("h4",{attrs:{id:"一些常见错误"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#一些常见错误"}},[a._v("#")]),a._v(" 一些常见错误")]),a._v(" "),s("ul",[s("li",[a._v("无法连接：网络故障或集群故障")]),a._v(" "),s("li",[a._v("连接无法关闭：网络故障或者节点出错")]),a._v(" "),s("li",[a._v("429：集群过于繁忙")])]),a._v(" "),s("h2",{attrs:{id:"分词-analysis"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#分词-analysis"}},[a._v("#")]),a._v(" 分词 Analysis")]),a._v(" "),s("p",[a._v("elasticSearch 分词器 Analyzer，分为三部分：")]),a._v(" "),s("ul",[s("li",[a._v("Character Filters: 原始文本处理，如去除 html 标签")]),a._v(" "),s("li",[a._v("Tokenizer: 按规则切分单词")]),a._v(" "),s("li",[a._v("Token Filter: 处理切分出来的单词，如大写转小写")])]),a._v(" "),s("p",[a._v("常用中文分词器："),s("a",{attrs:{href:"https://github.com/medcl/elasticsearch-analysis-ik",target:"_blank",rel:"noopener noreferrer"}},[a._v("elasticsearch-analysis-ik"),s("OutboundLink")],1),a._v("：支持自定义词库及热更新词库")]),a._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[a._v('# 内置标准分词器\nGET /_analyze\n{\n  "analyzer": "standard", \n  "text": "hello world"\n}\n\n# 中文插件分词器\nGET /_analyze\n{\n  "analyzer": "ik_smart", \n  "text": "朝闻国盛：2019年度医药行业研究策略报告"\n}\n')])])]),s("h2",{attrs:{id:"mapping-设置"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#mapping-设置"}},[a._v("#")]),a._v(" Mapping 设置")]),a._v(" "),s("p",[a._v("Mapping: 类似于 schema，其定义了索引中字段的名称 / 数据类型 / 倒排索引配置")]),a._v(" "),s("ul",[s("li",[a._v("Mapping 将 JSON 文档映射为 Lucene 中的偏平格式")]),a._v(" "),s("li",[a._v("一个文档只属于一个索引 Type，7.0 无需为 Mapping 设置 Type")])]),a._v(" "),s("h4",{attrs:{id:"数据类型"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#数据类型"}},[a._v("#")]),a._v(" 数据类型")]),a._v(" "),s("ul",[s("li",[a._v("Text / Keyword")]),a._v(" "),s("li",[a._v("Integer / Float")]),a._v(" "),s("li",[a._v("Date")]),a._v(" "),s("li",[a._v("IPV4 / IPV6")]),a._v(" "),s("li",[a._v("Object")]),a._v(" "),s("li",[a._v("其他：geo_point ...")])]),a._v(" "),s("h4",{attrs:{id:"dynamic-mappings"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#dynamic-mappings"}},[a._v("#")]),a._v(" Dynamic Mappings")]),a._v(" "),s("p",[a._v("写入文档时，elasticsearch 可自根据 json 格式自动创建索引，推算 Mapping 类型")]),a._v(" "),s("p",[a._v("对于"),s("code",[a._v("新增字段")]),a._v("：")]),a._v(" "),s("ul",[s("li",[a._v("Dynamic: true  文档写入成功，自动更新 Mapping；")]),a._v(" "),s("li",[a._v("Dynamic: false 文档写入成功，Mapping 不更新，字段无法被用于索引，但可在 _source 中找到相关信息；")]),a._v(" "),s("li",[a._v("Dynamic: strict 文档写入失败；")])]),a._v(" "),s("p",[a._v("对于"),s("code",[a._v("现有字段")]),a._v("：Mapping 字段不可修改，只能通过 reindex 重建索引")]),a._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[a._v('PUT /users/_doc/1\n{\n    "name": "Nick",\n    "age": 10,\n    "created_time": "2020-07-01T00:03:59Z"\n}\n\n\nPUT /users/_mapping\n{\n  "dynamic": "false"\n}\n\nPUT /users/_doc/1\n{\n    "name": "Nick",\n    "age": 10,\n    "from": "shanghai china",\n    "created_time": "2020-07-01T00:03:59Z"\n}\n\nGET /users/_mapping\n\n# 报错 from 字段未建倒排索引 无法查找\nGET /users/_search?q=from:china \n')])])])])}),[],!1,null,null,null);e.default=n.exports}}]);