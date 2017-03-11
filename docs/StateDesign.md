## State Design

####Overview

state主要包括五个部分

```json
{
    trajectories: {},
    statistics: {},
    cluster: {},
    tasks: {},
    controls: {}
}
```

####1 trajectories

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

####2 statistics

```json
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
}
```

####3 clusters

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

####4 tasks

```json
{
    collections: ["cellphone","taxiOD"],  // 操作的数据集合名称
    stages:[
        {
            name: "overview",
            completed: true,
            subtasks:[]
        },
        {
            name: "analysis",
            completed: false,
            subtasks:[]
        },
        {
            name: "conclusion",
            completed: false,
            subtasks:[]
        }
    ]
}
```

####5 controls

```json
{
    objects:[],
    parameters:[]
}
```