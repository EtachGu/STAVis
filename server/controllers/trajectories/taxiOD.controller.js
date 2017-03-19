import TaxiOD from '../../models/taxiOD';

/**
 * Get all taxiOD
 * @param req
 * @param res
 * @returns void
 */
export function getTaxiODs(req, res) {
  TaxiOD.find().limit(5).exec((err, data) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json(data);
  });
}

/**
 * Get a single data by datetime
 * @param req
 * @param res
 * @returns void
 */
export function getTaxiODByDatetime(req, res) {
  TaxiOD.find({ receivetime: new RegExp(req.params.datetime) },
      { taxinumber: 1, receivetime: 1, longitude: 1, latitude: 1, receivetime2: 1, longitude2: 1, latitude2: 1 }
    ).exec((err, data) => {
      if (err) {
        res.status(500).send(err);
      }
      res.json({ data });
    });
}


/**
 * Save a taxiOD
 * res POST request
 * @param req
 * @param res
 * @returns void
 *
 *  // {
	// 	datetime: "2016-03-01",
	// 	timeunit: "1hh",
	// 	id: [_id_],
	// 	data: [
	// 	{
	// 		// time 2016-03-01 00:00:00 ~ 2016-03-01 00:59:59
	// 		trajectories: [
	// 			[121.01, 31.54564, 121.03, 32,3543],     // _id1_
	// 		]
	// 	},
	// 	{
	// 		// time 2016-03-01 01:00:00 ~ 2016-03-01 01:59:59
	// 		trajectories: [
	// 			[121.01, 31.54564, 121.03, 32,3543],     // _id1_
	// 		]
	// 	},
	// ]
	// }
 */
export function getTaxiODByConditions(req, res) {
	if (!req.body) {
	res.status(403).end();
	}
	const datetime = req.body.datetime;
	const timeunit = req.body.timeunit;
	const ids = req.body.id;
	const match = {
		$match: {
			receivetime:{
				$gte: datetime[0],
				$lt: datetime[1]
			}
		}
	};
	const project = {
	  $project:
	  {
		  _id:0,
		  taxinumber: 1,
		  receivetime: {
			  $substr: ["$receivetime", 0, 13]
		  },
		  receivetime2: 1,
		  trajectories:[ "$longitude","$latitude", "$longitude2", "$latitude2"]
	  }
	};
	const group = {
		$group:{
			_id:"$receivetime",
			trajectories:{
				$push: "$trajectories"
			}
		}
	};
	// TaxiOD.find({ taxinumber: ids, },
	//   {_id:0, taxinumber: 1, receivetime: 1, longitude: 1, latitude: 1, receivetime2: 1, longitude2: 1, latitude2: 1 }).exec((err, data) => {
	// if (err) {
	//   res.status(500).send(err);
	// }
	// res.json({ datetime,
	// 	timeunit,
	// 	id:ids,
	// 	data, });
	// });

	TaxiOD.aggregate([match, project, group]).exec((err, data) => {
		if (err) {
			res.status(500).send(err);
		}
		res.json({
			datetime,
			timeunit,
			id:ids,
			data
		});
	})
}
