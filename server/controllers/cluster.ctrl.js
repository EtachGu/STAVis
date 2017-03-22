/**
 * Created by lenovo on 2017/3/19.
 */
import * as CellPhoneTrackCtrl from './trajectories/cellPhoneTrack.controller';
import * as Cluster from '../analysis/cluster';
/**
 * get Track Cluster by params
 * res POST request
 * @param req
 * @param res
 * @returns void
 *
 {
	 collectionName: _collectionsName_,
	 datetime:_datetime_,
	 fields: _fields_,
	 parameter: {
		 distance: _dis_,
		 minTrs : _minTrs_
	 }
 }
 */
const EARTH_RADIUS = 6371;  // km
export function getTrackClusters(req, res) {
	if (!req.body) {
		res.status(403).end();
	}
	const trajCollectionName = req.body.collectionName;
	switch(trajCollectionName) {
		case 'taxiOD':

			break;
		case 'cellPhoneTrack':
			CellPhoneTrackCtrl.getTrackByConditions(req,(data) => {
				if(data.err){
					res.status(500).send(data.err);
				} else {
					for(let i = 0; i  < data.data.length; i++) {
						const trajSet = data.data[i].trajectories.map( e => {
							return JSON.parse(e).coordinates;
						});
						Cluster.dbscan(trajSet,10,2,1/EARTH_RADIUS,1/EARTH_RADIUS);
					}
					res.json(data);
				}
			});
			break;
		case 'publicTransit':break;
		default:res.json({});
	}
}