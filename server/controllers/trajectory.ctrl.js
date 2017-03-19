/**
 * Created by lenovo on 2017/3/19.
 */
import * as taxiOD from './trajectories/taxiOD.controller';

/**
 * Get all track
 * @param req
 * @param res
 * @returns void
 */
export function getTracks(req, res) {
	if (!req.body) {
		res.status(403).end();
	}
	const trajDBName = req.body.trajName;
	switch(trajDBName) {
		case 'taxiOD':
			taxiOD.getTaxiODs(req, res);
			break;
		case 'cellPhoneTrack':break;
		case 'publicTransit':break;
		default:
	}
}


/**
 * get Track by params
 * res POST request
 * @param req
 * @param res
 * @returns void
 *
 * {
 *   trajName: _trajName_,
 *   datetime: [],
 *   timeunit：_timeunit_,
 *   id: [],
 *	}
 */
export function getTrackByConditions(req, res) {
	if (!req.body) {
		res.status(403).end();
	}
    const trajDBName = req.body.trajName;
	switch(trajDBName) {
		case 'taxiOD':
			taxiOD.getTaxiODByConditions(req, res);
			break;
		case 'cellPhoneTrack':break;
		case 'publicTransit':break;
		default:
	}
}
