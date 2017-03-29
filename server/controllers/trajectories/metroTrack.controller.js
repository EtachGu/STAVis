import StatisticMetro from '../../models/statisticMetroTrack';

export function getMetroCount (type, startDate,endDate,timeunit,fields, callback) {
	
	const match = {
		$match: {
			icdate:{
				$gte: startDate,
				$lt: endDate
			}
		}
	};
	const project = {
		$project:
		{
			_id:0,
			icstation: 1,
			hours: 1,
			count:1,
		}
	};
	const group = {
		$group:{
			_id:"$hours",
			data:{
				$push: {name:"$icstation",value:"$count"}
			}
		}
	};

	const sort = {
		$sort : { _id : 1 }
	}

	const project2 = {
		$project: {
				_id: 0,
				data: 1
		}
	}

	StatisticMetro.aggregate([match, project, group, sort, project2]).exec((err, data) => {
		if (err) {
			callback({err});
		} else {
			callback(data);
		}
	});
}