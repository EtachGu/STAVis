/**
 * Created by lenovo on 2017/3/19.
 */
import * as taxiOD from './trajectories/taxiOD.controller';
import * as CellPhoneTrackCtrl from './trajectories/cellPhoneTrack.controller';
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
	if (req.is('text/*')){
		req.body = JSON.parse(req.body);
	}
	const trajDBName = req.body.trajName;
	switch(trajDBName) {
		case 'taxiOD':
			taxiOD.getTaxiODByConditions(req, res);
			break;
		case 'cellPhoneTrack':
			postCellPhoneTrack(req, res);
			break;
		case 'publicTransit':break;
		default:
	}
}

function postCellPhoneTrack(req, res) {
	const datetime = req.body.datetime;
	const startTime  = new Date(datetime[0]);
	const endTime = new Date(datetime[1]);
	const startDate = startTime.getFullYear() * 10000 + (startTime.getMonth()+1) * 100 + startTime.getDate();
	const endDate = endTime.getFullYear() * 10000 + (endTime.getMonth()+1) * 100 + endTime.getDate();
	const timeunit = req.body.timeunit;
	const ids = req.body.id;   //  clusterid

	CellPhoneTrackCtrl.getTrackByClusterId(ids,startDate,endDate,timeunit,(data) => {
		if(data.err){
			res.status(500).send(data.err);
		} else {
			res.json({
				datetime,
				timeunit,
				id:ids,
				data
			});
		}
	});
}