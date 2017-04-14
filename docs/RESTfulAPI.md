##RESTful API

###1 trajectory data

-----

####`GET` http://localhost:3000/trajectory/:trajName?datetime=_datetime_&timeunit=_timeunit_&id=_id_

**Resquest 参数说明**

+ trajName: 为数据集的名称，例如MongoDB中collection的名称
+ datetime: 查询的时间范围，可以为一个时间点或者时间范围，例如'2016-03-01',['2016-03-03','2016-03-05']
+ timeunit: 时间粒度，例如 mm(分钟)，hh(小时)，dd(天)
+ id: 唯一标识_id_, 缺省的情况，代表所有的对象都会查找

**Response 返回的数据**

返回的data 按照时间粒度，将时间点划分为多个数据片段。例如 以1hh（小时）为时间粒度，则可以将datetime"2016-03-01"划分为24个时间片段，对应的data集合包含为24块。

```json
{
    datetime: "2016-03-01",
    timeunit: "1hh",
    id: [_id_],
    data: [
        {
            // time 2016-03-01 00:00:00 ~ 2016-03-01 00:59:59
            trajectories: [
                [121.01, 31.54564, 121.03, 32,3543],     // _id1_
            ]
        },
        {   
            // time 2016-03-01 01:00:00 ~ 2016-03-01 01:59:59
            trajectories: [
                [121.01, 31.54564, 121.03, 32,3543],     // _id1_
            ]
        },
    ]
}
```

####`POST` http://localhost:3000/trajectory

**Resquest 参数说明**

请求头 body

```json
{
    trajName: _trajName_,
    datetime: [],
    timeunit：_timeunit_,
    id: [],
}
```

+ trajName: 为数据集的名称，例如MongoDB中collection的名称
+ datetime: 查询的时间范围，可以为一个时间点或者时间范围，例如['2016-03-01'],['2016-03-03','2016-03-05']
+ timeunit: 时间粒度，例如 mm(分钟)，hh(小时)，dd(天)
+ id: 唯一标识列表

**Response 返回的数据**

返回数据按照id集合元素的顺序进行组织，其中data 按照时间粒度，将时间点划分为多个数据片段。例如 以1hh（小时）为时间粒度，则可以将datetime"2016-03-01"划分为24个时间片段，对应的data集合包含为24块

```json
{
    datetime: "2016-03-01",
    timeunit: "1hh",
    id:[_id1_,_id2_],
    data: [
        {
            // time 2016-03-01 00:00:00 ~ 2016-03-01 00:59:59
            trajectories: [
                [121.01, 31.54564, 121.03, 32,3543],    // _id1_
                [120.0132, 31.53564, 122.0133, 32,3343] // _id2_
            ]
        },
        {
            // time 2016-03-01 01:00:00 ~ 2016-03-01 01:59:59
            trajectories: [
                [121.01, 31.54564, 121.03, 32,3543],     // _id1_
                [120.0132, 31.53564, 122.0133, 32,3343]  // _id2_
            ]
        }
    ]
}
```

###2 Statistic data

----

统计轨迹中的属性数据

####`GET` http://localhost:3000/statistics/:collectionName?type=_avg_&datetime=_datetime_&timeunit=_timeunit_&filed=_filed_

**Resquest 参数说明**

+ collectionName: 为数据集的名称，例如MongoDB中collection的名称
- type: 统计的类型，
    + `avg` 表示均值
    + `count` 表示总数
+ datetime: 查询的时间范围，可以为一个时间点或者时间范围，例如'2016-03-01',['2016-03-03','2016-03-05']
+ timeunit: 划分的时间粒度，若缺省，则将datetime 作为一个整体
+ filed: 需要统计的字段_field_

**Response 返回的数据**

```json
{
    collectionName: "",
    type:_avg_,
    datetime: "2016-03-01",
    timeunit: _timeunit_,
    field:"",
    data: [],
}
```

data 中元素按照时间粒度依次排列


####`POST` http://localhost:3000/statistics

**Resquest 参数说明**

请求头 body

```json
[
    {
        collectName: _taxi_,
        type: _count_,
        datetime: "2016-03-02",
        timeunit: _timeunit_,
        fields: [_field1_,_field2_]
    },
    {
        collectName: _bus_,
        type: _avg_,
        datetime: ["2016-03-02","2016-03-05"],
        timeunit: _timeunit_,
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
        timeunit: _timeunit_,
        fields: [_field1_,_field2_],
        data: [
            [_field1data1_,_field2data1_], // time = datetime + timeunit
            [_field1data2_,_field2data2_]  // time = datetime + 2 * timeunit
        ]
    },
    {
        collectName: _bus_,
        type: _avg_,
        datetime: ["2016-03-02",'2016-03-05'],
        timeunit: _timeunit_,
        fields: [_field1_],
        data: [
            [__field1data1_], // time = datetime + timeunit
            [_field1data2_]   // time = datetime + 2 * timeunit
        ]
    }
]
```
或者
```
    {
        collectName: _bus_,
        type: _avg_,
        datetime: ["2016-03-02",'2016-03-05'],
        series: [_seriesName1_,_seriesName2_],
        fields: [_field1_,_field2_],
        data: [
            [__field1data1_,_field2data1_], // _seriesName1_
            [_field1data2__field2data2_]   // _seriesName2_
        ]
    }
]
```
其中_data1_、_data2_中数据值按照时间粒度组织

###3 Cluster data

---

####`POST` http://localhost:3000/cluster

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


###4 Mover information

查询 移动对象（或 用户、车辆、司机）的信息

####`GET` http://localhost:3000/moverinfo/:collectionName?name=_name_&id=_id_

+ collectionName: 为数据集的名称，例如MongoDB中collection的名称
+ name: 用户的名称
+ id： 用户的唯一标识ID
...

**Response 返回的数据**

```json
{
    collectionName: "",
    data: [{
        id: _id1_,
        name: _name2_,
        field1: _f1_,
        field2: _f2_
    },{
        id: _id2_,
        name: _name2_,
        field1: _f1_,
        field2: _f2_
    }],
}
```

####`POST` http://localhost:3000/moverinfo

**Resquest 参数说明**

```json
{
    collectionName: _collectionsName_,
    id: [_id1_, _id2_],
    name: [_name1_, _name2_],
    fields: [_field1_, _field1_],          // 需要返回的 字段名称
    condition：{}                      // [可选] MongoDB 条件查询 设置， 
}
```

**Response 返回的数据**

```json
{
    collectionName: "",
    data: [{
        id: _id1_,
        name: _name2_,
        field1: _f1_,
        field2: _f11_,
    },{
        id: _id2_,
        name: _name2_,
        field1: _f2_,
        field2: _f21_,
    }],
}
```