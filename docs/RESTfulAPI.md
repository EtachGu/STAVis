##RESTful API

###1 trajectory data

-----

####`GET` http://localhost:3000/trajectory/:trajName?datetime=_datetime_&id=_id_

**Resquest 参数说明**

+ trajName: 为数据集的名称，例如MongoDB中collection的名称
+ datetime: 查询的时间范围，可以为一个时间点或者时间范围，例如'2016-03-01',['2016-03-03','2016-03-05']
+ id: 唯一标识_id_

**Response 返回的数据**

```json
{
    datetime: "2016-03-01 01",
    trajectories: [
        [121.01, 31.54564, 121.03, 32,3543],
        [120.0132, 31.53564, 122.0133, 32,3343]
    ]
}
```

####`POST` http://localhost:3000/trajectory

**Resquest 参数说明**

请求头 body

```json
{
    trajName: []
    datetime: []
    id: []
}
```

+ trajName: 为数据集的名称，例如MongoDB中collection的名称,或集合
+ datetime: 查询的时间范围，可以为一个时间点或者时间范围，例如['2016-03-01'],['2016-03-03','2016-03-05']
+ id: 唯一标识列表

**Response 返回的数据**

```json
[
    {
        datetime: "2016-03-01",
        trajectories: [
            [121.01, 31.54564, 121.03, 32,3543],
            [120.0132, 31.53564, 122.0133, 32,3343]
        ]
    },
    {
        datetime: "2016-03-02",
        trajectories: []
    }
]
```

###2 Statistic data

----

####`GET` http://localhost:3000/statistics/:collectionName?type=_avg_&datetime=_datetime_&filed=_filed_


**Resquest 参数说明**

+ collectionName: 为数据集的名称，例如MongoDB中collection的名称
- type: 统计的类型，
    + `avg` 表示均值
    + `count` 表示总数
+ datetime: 查询的时间范围，可以为一个时间点或者时间范围，例如'2016-03-01',['2016-03-03','2016-03-05']
+ filed: 需要统计的字段_field_

**Response 返回的数据**

```json
{
    collectionName: "",
    type:_avg_,
    datetime: "2016-03-01",
    field:"",
    data: _data_,
}
```

####`POST` http://localhost:3000/statistics

**Resquest 参数说明**

请求头 body

```json
[
    {
        collectName: _taxi_,
        type: _count_,
        datetime: "2016-03-02",
        fields: [_field1_,_field2_]
    },
    {
        collectName: _bus_,
        type: _avg_,
        datetime: ["2016-03-02","2016-03-05"]
        fields: [_field1_]
    }
]
```
+ collectName: 为数据集的名称，例如MongoDB中collection的名称
+ datetime: 查询的时间范围，可以为一个时间点或者时间范围，例如['2016-03-01'],['2016-03-03','2016-03-05']
+ filed: 需要统计的字段_field_

**Response 返回的数据**

```json
[
    {
        collectName: _taxi_,
        type: _count_,
        datetime: "2016-03-02",
        fields: [_field1_,_field2_],
        data: [[_data1_],[_data2_]]
    },
    {
        collectName: _bus_,
        type: _avg_,
        datetime: ["2016-03-02",'2016-03-05'],
        fields: [_field1_],
        data: [_data1_]
    }
]
```

###3 Cluster data

---

####`POST` http://localhost:3000/cluster/:collectionName

**Resquest 参数说明**

```json
{
    collectionName: _collectionsName_,
    datetime:_datetime_,
    fields: _fields_,
    parameter: {
        distance: _dis_,
        minTrs : _minTrs_
    }
}
```

+ collectionName: 为数据集的名称，例如MongoDB中collection的名称
+ datetime: 查询的时间范围，可以为一个时间点或者时间范围，例如'2016-03-01',['2016-03-03','2016-03-05']
+ filed: 需要统计的字段_field_
+ parameter: 聚类的参数, 例如，distance表示距离，minTrs最小公共核密度数目

**Response 返回的数据**

```json
{
    collectionName: "",
    datetime: "2016-03-01",
    clusters: [
        [culster1],
        [culster2],
    ]
}
```


