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
			trajectories:["$longitude1","$latitude1","$longitude2","$latitude2","$longitude3","$latitude3","$longitude4","$latitude4","$longitude5","$latitude5","$longitude6","$latitude6","$longitude7","$latitude7","$longitude8","$latitude8","$longitude9","$latitude9","$longitude10","$latitude10","$longitude11","$latitude11","$longitude12","$latitude12","$longitude13","$latitude13","$longitude14","$latitude14","$longitude15","$latitude15","$longitude16","$latitude16","$longitude17","$latitude17","$longitude18","$latitude18","$longitude19","$latitude19","$longitude20","$latitude20","$longitude21","$latitude21","$longitude22","$latitude22","$longitude23","$latitude23","$longitude24","$latitude24"]
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

	CellPhoneTrack.aggregate([match, project, group]).exec((err, data) => {
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
