/**
 * Created by evan gu on 2017/3/18.
 */
import _ from 'lodash';
import { distSeq } from './similarity';


/**
 *  LCS-DBSCAN Cluster
 * @param tr
 * @param epsilon  number of nearest trajectories
 * @param minTrs
 * @param gamma minLength of LCS
 * @param delta points distance
 */
export function dbscan(tr, epsilon, minTrs, gamma, delta) {
	let clusterID = 0;
	const trD = disMatrix(tr, epsilon, gamma, delta);
	// visit 0 = unvisited, visit 1 = visited
	tr.forEach(e => e.visit = 0);
	for (let i = 0; i < tr.length; i++){
		const e = tr[i];
		e.visit = 1;
		const Ni = getNestTrajectory(tr, trD, i, epsilon);
		if (Ni.length < minTrs) {
			e.nose = true;
		}
		else {
			clusterID++;
			e.clusterID = clusterID;
			Ni.forEach( nTri => nTri.clusterID = clusterID);
			expendCluster(clusterID, Ni, trD, epsilon, minTrs);
		}
	}
	//tr.sort((a, b) => a.clusterID - b.clusterID);
	return _.keyBy(tr,'clusterID');
}

/**
 *
 * @param tr
 * @param epsilon
 * @param gamma
 * @param delta
 * @returns {Array}
 */
export function disMatrix(tr,epsilon, gamma, delta) {
	const distMatrix = [];
	for (let i = 0; i < tr.length; i++) {
		for (let j = i + 1; j < tr.length; j++) {
			if(distMatrix[i] === undefined){
				distMatrix[i] = [];
			}
			distMatrix[i][j] = distSeq(tr[i], tr[j], epsilon, gamma, delta);
		}
	}
	return distMatrix;
}

/**
 *
 * @param tr
 * @param trD
 * @param i
 * @param epsilon
 * @returns {Array}
 */
function getNestTrajectory(tr, trD, i, epsilon) {
	const Ni = [];
	const length = tr.length;
	for (let j = i + 1; j < length; j++) {
		if ((typeof  trD[i][j] !== 'undefined') && trD[i][j] < epsilon) {
			Ni.push(tr[j]);
		}
	}
	for (let j = i - 1; j >= 0; j--) {
		if((typeof  trD[j][i] !== 'undefined') && trD[i][j] < epsilon) {
			Ni.push(tr[j]);
		}
	}
	return Ni;
}
/**
 *
 * @param tr
 * @param clusterID
 * @param Q
 * @param trD
 * @param epsilon
 * @param minTrs
 */
function expendCluster(tr, clusterID, Q, trD,epsilon, minTrs) {
	while (Q.length!==0) {
		const trj = Q.shift();
		const i = trj.index;
		const Ni = getNestTrajectory(tr, trD, i, epsilon);
		if (Ni.length > minTrs) {
			Ni.forEach( e => {
				if (e.visit !== 1 || !e.nose) {
					e.clusterID = clusterID
				}
				if (e.visit !== 1){
					Q.push(e);
				}
			})
		}
	}
}