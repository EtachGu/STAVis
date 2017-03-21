/**
 * Created by Evan Gu on 2017/3/19.
 */
import CellPhoneTrack from '../../models/cellPhoneTrack';

/**
 * Get all CellPhoneTrack
 * @param req
 * @param res
 * @returns void
 */
export function getTrackss(req, res) {
	CellPhoneTrack.find().limit(5).exec((err, posts) => {
		if (err) {
			res.status(500).send(err);
		}
		res.json({ posts });
	});
}

/**
 * Get a single data by datetime
 * @param req
 * @param res
 * @returns void
 */
export function getTaxiODByDatetime(req, res) {
	CellPhoneTrack.find({ receivetime: new RegExp(req.params.datetime) },
		{ taxinumber: 1, receivetime: 1, longitude: 1, latitude: 1, receivetime2: 1, longitude2: 1, latitude2: 1 }
	).exec((err, data) => {
		if (err) {
			res.status(500).send(err);
		}
		res.json({ data });
	});
}


/**
 * Save a CellPhoneTrack
 * res POST request
 * @param req
 * @param callback
 * @returns void
 */
export function getTrackByConditions(req, callback) {

	if (!req.body) {
		res.status(403).end();
	}
	const datetime = req.body.datetime;
	const startTime  = new Date(datetime[0]);
	const endTime = new Date(datetime[1]);
	const startDate = startTime.getFullYear() * 10000 + (startTime.getMonth()+1) * 100 + startTime.getDate();
	const endDate = endTime.getFullYear() * 10000 + (endTime.getMonth()+1) * 100 + endTime.getDate();
	const timeunit = req.body.timeunit;
	const ids = req.body.id;
	const match = {
		$match: {
			Date:{
				$gte: startDate,
				$lt: endDate
			}
		}
	};
	const project = {
		$project:
		{
			_id:0,
			Date: 1,
			id:"$IMEI",
			trajectories:"$geom"
		}
	};
	const group = {
		$group:{
			_id:"$Date",
			id:{
				$push: "$id"
			},
			trajectories:{
				$push: "$trajectories"
			}
		}
	};

	const other = {
		$limit: 20
	};

	CellPhoneTrack.aggregate([match, project, group, other]).exec((err, data) => {
		if (err) {
			callback({
				err
			});
		} else {
			callback({
				datetime,
				timeunit,
				id:ids,
				data
			});
		}
		// res.json({
		// 	datetime,
		// 	timeunit,
		// 	id:ids,
		// 	data
		// });

	})
}
