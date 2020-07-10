# Query DSL使用入门

## GET and POST
Get表示查询，Post表示添加数据

Get语句可以使用**[index]/_search**查询特定索引下的数据

例-GET：
```
GET ri_search_reports/_search
{
  "query": {
    "match": {
      "rpt_subtit": "定义核心资产"
    }
  }
}
```

## query 和 filter 差异
### query DSL
在查询上下文中，查询会回答这个问题——“这个文档匹不匹配这个查询，它的相关度高么？”

如何验证匹配很好理解，如何计算相关度呢？ES中索引的数据都会存储一个_score分值，分值越高就代表越匹配。另外关于某个搜索的分值计算还是很复杂的，因此也需要一定的时间。

查询上下文 是在 使用query进行查询时的执行环境，比如使用search的时候。

一些query的场景：

* 与full text search的匹配度最高
* 包含run单词，如果包含这些单词：runs、running、jog、sprint，也被视为包含run单词
* 包含quick、brown、fox。这些词越接近，这份文档的相关性就越高

### filter DSL
在过滤器上下文中，查询会回答这个问题——“这个文档匹不匹配？”

答案很简单，是或者不是。它不会去计算任何分值，也不会关心返回的排序问题，因此效率会高一点。

过滤上下文 是在使用filter参数时候的执行环境，比如在bool查询中使用Must_not或者filter

另外，经常使用过滤器，ES会自动的缓存过滤器的内容，这对于查询来说，会提高很多性能。

一些过滤的情况：

* 创建日期是否在2013-2014年间？
* status字段是否为published？
* lat_lon字段是否在某个坐标的10公里范围内？


### 区别
1. filter并不能直接替换query使用，必须包含在`bool`多条件语句后或者其他关键词下，同时filter下不能使用match，因为它并考虑分词，只是用作过滤，所以可以使用`range`或者`term`等
2. query 和 filter 一起使用的话，filter 会先执行，看本文下面的：多搜索条件组合查询
3. 从搜索结果上看：
    * filter，只查询出搜索条件的数据，不计算相关度分数
    * query，查询出搜索条件的数据，并计算相关度分数，按照分数进行倒序排序
4. 从性能上看：
    * filter（性能更好，无排序），无需计算相关度分数，也就无需排序，内置的自动缓存最常使用查询结果的数据
    * query（性能较差，有排序），要计算相关度分数，按照分数进行倒序排序，没有缓存结果的功能
    * filter 和 query 一起使用可以兼顾两者的特性，所以看你业务需求
5. [官网文档](https://www.elastic.co/guide/en/elasticsearch/guide/current/_queries_and_filters.html)

例-query：
```
GET ri_search_reports/_search
{
  "query": {
    "match": {
      "rpt_subtit": "定义核心资产"
    }
  }
}
```
例-filter多条件组合：
```
GET ri_search_reports/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "rpt_subtit": "定义核心资产"
          }
        }
      ], 
      "filter": {
        "term": {
          "rpt_subtit.keyword": "定义核心资产：误区和标准"
        }
      }
    }
  }
}
```

## bool多搜索条件组合查询
Bool查询对应Lucene中的BooleanQuery，它由一个或者多个子句组成，每个子句都有特定的类型

* must：返回的文档必须满足must子句的条件，并且参与计算分值，类似于=
* filter：返回的文档必须满足filter子句的条件。但是不会像Must一样，参与计算分值，类似于=
* should：返回的文档可能满足should子句的条件，类似于or
    * 在一个Bool查询中，如果没有must或者filter，有一个或者多个should子句，那么只要满足一个就可以返回
    * 如果一个查询既有filter又有should，那么至少包含一个should子句
    * `minimum_should_match`参数定义了至少满足几个子句
* must_not：返回的文档必须不满足must_not定义的条件，类似于!=

例-bool多搜索条件组合：
```
GET ri_search_reports/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "rpt_subtit": "定义核心资产"
          }
        }
      ], 
      "filter": {
        "term": {
          "rpt_subtit.keyword": "定义核心资产：误区和标准"
        }
      },
      "should": [
        {
          "match": {
            "rpt_subtit": {
              "query": "定义核心资产",
              "operator": "or"
            }
          }
        }
      ],
      "must_not": [
        {
          "match": {
            "rpt_subtit": "测试"
          }
        }
      ],
      "minimum_should_match": 1
    }
  }
}
```

## 各类查询关键词

### match_all
* 查询所有

例：
```
GET ri_search_reports/_search
{
  "query": {
    "match_all": {}
  }
}
```

### match
* full-text search 全文检索，倒排索引
* 索引中只要有任意一个匹配拆分后词就可以出现在结果中，只是匹配度越高的排越前面
* 比如查询：PHILIPS toothbrush，会被拆分成两个单词：PHILIPS 和 toothbrush。只要索引中 product_name 中只要含有任意对应单词，都会在搜索结果中，只是如果有数据同时含有这两个单词，则排序在前面
* match可以配合`opeartor`操作符达到和match_phrase一样的效果
* 还可以使用`minimum_should_match`选择需要匹配的分词百分比。比如搜索词被分成这样子：java 程序员 书 推荐，这里就有 4 个词，假如要求 50% 命中其中两个词就返回，我们就可以设置`minimum_should_match`为50%

例：
```
GET ri_search_reports/_search
{
  "query": {
    "match": {
      "rpt_subtit": {
        "query": "定义核心资产测试",
        "operator": "or",
        "minimum_should_match": "50%"
      }
    }
  }
}
```

### match_phrase
* phrase search 短语搜索
* 索引中必须同时匹配拆分后词就可以出现在结果中
* 比如查询：PHILIPS toothbrush，会被拆分成两个单词：PHILIPS 和 toothbrush。索引中必须有同时有这两个单词的才会在结果中

例：
```
GET ri_search_reports/_search
{
  "query": {
    "match_phrase": {
      "rpt_subtit": {
        "query": "定义核心资产"
      }
    }
  }
}
```

### multi_match
* 查询多字段同时包含某些分词的时候，可以使用
* 比如查询 product_name 和 product_desc 字段中，只要有：toothbrush 关键字的就查询出来
* 同时可以使用`opeartor`来决定是and还是or

例：
```
GET ri_search_reports/_search
{
  "query": {
    "multi_match": {
      "query": "定义核心资产",
      "fields": [
        "rpt_subtit", "rpt_summary"
      ]
    }
  }
}
```

### term
* term 一般用在不分词字段上的，因为它是完全匹配查询，如果要查询的字段是分词字段就会被拆分成各种分词结果，和完全查询的内容就对应不上了
* Elasticsearch 5.X 之后给 text 类型的分词字段，又默认新增了一个子字段 keyword，这个字段的类型就是 keyword，是不分词的，默认保留 256 个字符。假设 product_name 是分词字段，那有一个 product_name.keyword 是不分词的字段，可以利用这个子字段来做完全匹配查询

例：
```
GET ri_search_reports/_search
{
  "query": {
    "term": {
      "rpt_subtit.keyword": "定义核心资产：误区和标准"
    }
  }
}
```

### terms
* 同上term，区别在于类似于数据库的 in

例：
```
GET ri_search_reports/_search
{
  "query": {
    "terms": {
      "rpt_subtit.keyword": [
        "定义核心资产：误区和标准",
        "5G标准落定，贸易摩擦风波未平，通信板块仍处寻底过程"
      ]
    }
  }
}
```

### range
* range 用法，查询数值、时间区间

例：
```
GET ri_search_reports/_search
{
  "query": {
    "range": {
      "custom_report": {
        "gt": 0,
        "lte": 1
      }
    }
  }
}
```

### 分页- from, size
可以使用`size`，`from`关键词来做搜索分页

例：
```
GET ri_search_reports/_search
{
  "query": {
    "multi_match": {
      "query": "定义核心资产",
      "fields": [
        "rpt_subtit", "rpt_summary"
      ]
    }
  },
  "size": 1,
  "from": 0
}
```

### 高亮搜索-highlight
可以对搜索结果中的分词进行高亮显示，用em标签包裹

例：
```
GET ri_search_reports/_search
{
  "query": {
    "match": {
      "rpt_subtit": "定义核心资产"
    }
  },
  "highlight": {
    "fields": {
      "rpt_subtit": {}
    }
  }
}
```
结果：
```
"highlight" : {
  "rpt_subtit" : [
    "<em>定</em><em>义</em><em>核</em><em>心</em><em>资</em><em>产</em>：误区和标准"
  ]
}
```

### 指定查询结果字段-_source
可以使用_source指定返回字段

例：
```
GET ri_search_reports/_search
{
  "query": {
    "match": {
      "rpt_subtit": "定义核心资产"
    }
  },
  "_source": [
    "rpt_subtit",
    "author_names"
  ]
}
```

### boost指定权重
在搜索中可以使用boost来指定不同搜索条件的权重，权重高的优先于权重低的

例：
```
GET ri_search_reports/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "rpt_subtit": {
              "query": "定义核心资产",
              "boost": 2
            }
          }
        },
        {
          "match": {
            "rpt_subtit": {
              "query": "央行重启逆回购",
              "boost": 1
            }
          }
        }
      ],
      "minimum_should_match": 1
    }
  }
}
```

### slop 用法
待更新

### rescore，window_size重新打分
待更新

### sort 排序
待更新

## 参考资料
1. [Elasticsearch DSL 常用语法介绍](https://blog.csdn.net/jiaminbao/article/details/80105636?utm_medium=distribute.pc_relevant_t0.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase)
2. [ES中的Query与Filter的区别](https://blog.csdn.net/qq_29580525/article/details/80908523)