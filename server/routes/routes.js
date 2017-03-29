/**
 * Created by lenovo on 2017/3/19.
 */
import { Router } from 'express';
import * as trajectoryCtrls from '../controllers/trajectory.ctrl';
import * as clusterCtrls from '../controllers/cluster.ctrl';
import * as statisticsCtrls from '../controllers/statistics.ctrl';
const router = new Router();

/**
 *  Trajectory API
 *  /trajectory/:trajName?datetime=_datetime_&timeunit=_timeunit_&id=_id_
 */
router.route('/trajectory/:trajName').get(trajectoryCtrls.getTracks);
router.route('/trajectory').post(trajectoryCtrls.getTrackByConditions);

/**
 * Statistic API
 * http://localhost:3000/statistics/:collectionName?type=_avg_&datetime=_datetime_&timeunit=_timeunit_&filed=_filed_
 */
// router.route('/statistics/:collectionName').get(TaxiODController.getTaxiODs);
router.route('/statistics').post(statisticsCtrls.getStatisticByConditions);

/**
 * Cluster API
 * http://localhost:3000/cluster
 */
router.route('/cluster').post(clusterCtrls.getTrackClusters);

router.all('*',function(req,res,next) {
	res.set({
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'Content-Type',
		'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
	});
	next();
});

export default router;