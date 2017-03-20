/**
 * Created by lenovo on 2017/3/19.
 */
import { Router } from 'express';
import * as trajectoryCtrls from '../controllers/trajectory.ctrl';
import * as clusterCtrls from '../controllers/cluster.ctrl';
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
// router.route('/statistics').get(TaxiODController.getTaxiODs);

/**
 * Cluster API
 * http://localhost:3000/cluster
 */
router.route('/cluster').post(clusterCtrls.getTrackClusters);

export default router;