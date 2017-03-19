import { Router } from 'express';
import * as TaxiODController from '../controllers/trajectories/taxiOD.controller.js';
const router = new Router();

// Get all Posts
router.route('/taxiOD').get(TaxiODController.getTaxiODs);

// Get one taxiOD by datetime
router.route('/taxiOD/:datetime').get(TaxiODController.getTaxiODByDatetime);

// Get taxiOD by parameters
router.route('/taxiOD').post(TaxiODController.getTaxiODByConditions);

export default router;
