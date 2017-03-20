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
						const trajectory = data.data[i].trajectories;
						const trajSet = trajectory.map( e => {
							const newTraj = [];
							for(let i = 1; i<e.length; i+=2) {
								newTraj.push([e[i-1],e[i]]);
							}
							return newTraj;
						});
						Cluster.dbscan(trajSet,10,2,500,500);
					}
					res.json(data);
				}
			});
			break;
		case 'publicTransit':break;
		default:res.json({});
	}
}