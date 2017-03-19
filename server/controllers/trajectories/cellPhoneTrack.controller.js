/**
 * Created by Evan Gu on 2017/3/19.
 */
import CellPhoneTrack from '../../models/taxiOD';

/**
 * Get all CellPhoneTrack
 * @param req
 * @param res
 * @returns void
 */
export function getTaxiODs(req, res) {
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
 * @param res
 * @returns void
 */
export function getTaxiODByConditions(req, res) {
	if (!req.body.post.content) {
		res.status(403).end();
	}

	CellPhoneTrack.find(req.body.post.content).exec((err, data) => {
		if (err) {
			res.status(500).send(err);
		}
		res.json({ data });
	});
}
