/**
 * Created by evan gu on 2017/3/18.
 */
import { geoDistance } from 'd3-geo';
/**
 *
 * @param traj1  [ [lon,lat] , [lon,lat] ]
 * @param traj2
 * @param gamma
 * @param delta
 * @returns {number}
 */
export function distSeq(traj1, traj2, gamma, delta) {
	return 1 - simSeq(traj1, traj2, gamma, delta);
}

/**
 * compute the simSeqValue of two trajectories
 * @param traj1
 * @param traj2
 * @param gamma   length of LCS constraint
 * @param delta  points distance
 * @returns number
 **/
export function simSeq(traj1, traj2, gamma, delta) {
	const len1 = lenSeq(traj1);
	const len2 = lenSeq(traj2);
	if (len1 < gamma || len2 < gamma)
		return 0;
	const simMatrix = [];
	if (maxSimT(traj1, traj2, simMatrix, delta) === 0)
		return 0;
	const lcsPoints = LCS(traj1, traj2, simMatrix);
	const lenLcs1 = lenSeq(lcsPoints.map( e => e[0]));
	const lenLcs2 = lenSeq(lcsPoints.map( e => e[1]));
	if (Math.min(lenLcs1, lenLcs2) < gamma)
		return 0;
	if (len1 >= len2  ) {
		return  lenLcs2 / len2;
	}
	return  lenLcs1 / len1;
}

/**
 * compute the LCS length
 * @param points
 * @returns number
 *
 * lcsPoints is typeof Array, and it is consisted of Points from the
 *  Long Common Sequences of two trajectories
 * lcsPoints 为两条轨迹公共点集合
 */
export function lenSeq(points) {
	const size = points.length;
	let len = 0;
	for (let i = 1; i < size; i++) {
		const startPoint = [points[i-1][0],points[i-1][1]];
		const endPoint = [points[i][0],points[i][1]];
		len += geoDistance(startPoint, endPoint);
	}
	return len;
}


/**
 * 计算两条轨迹之间的最近距离
 * compute the distance between two Trajs
 * @param traj1
 * @param traj2
 * @returns number
 *
 */
export function distance(traj1, traj2) {
	let minDis = Number.MAX_VALUE;
	for (let i = 0; i < traj1.length ; i++ ){
		for (let j = 0; j < traj2.length; j++) {
			const startPoint = [traj1[i][0],traj1[i][1]];
			const endPoint = [traj2[j][0],traj2[j][1]];
			const dis = geoDistance(startPoint,endPoint);
			if (minDis > dis)
				minDis = dis;
		}
	}
	return minDis;
}

/**
 * 计算两个点的相似性
 * @param point1
 * @param point2
 * @param delta
 * @returns number
 *
 * delta 为两个点之间距离范围值，超过这个值，两个点位置就不相似
 */
export function simPoints(point1, point2, delta) {
	const startPoint = [point1[0],point1[1]];
	const endPoint =  [point2[0],point2[1]];
	const dist = geoDistance(startPoint, endPoint);
	let result = 0;
	if (dist > delta)
		return result;
	result = dist / delta;
	return result;
}


/**
 * 计算两条轨迹的最大公共子序列得分
 * @param traj1
 * @param traj2
 * @param lcsPoints
 * @param delta
 * @returns number
 *
 * traj1 和 traj2 都为数组
 * delta 为两个点之间距离范围值，超过这个值，两个点位置就不相似
 */
export function scoreLCS(traj1, traj2, lcsPoints, delta) {
	const trajLenght1 = traj1.length;
	const trajLenght2 = traj2.length;
	if (trajLenght1 === 0 || trajLenght2 ===0)
		return 0;
	const nextTraj1 = traj1.slice(1,trajLenght1);
	const nextTraj2 = traj2.slice(1,trajLenght2);
	const score = [0, 0, 0];
	score[0] = scoreLCS(nextTraj1, nextTraj2, lcsPoints, delta) + simPoints(traj1[0], traj2[0], delta);
	score[1] = scoreLCS(nextTraj1, traj2, lcsPoints, delta);
	score[2] = scoreLCS(traj1, nextTraj2, lcsPoints, delta);

	let maxIndex = 0;
	for (let i = 1; i < 3; i++) {
		if (score[i] > score[maxIndex]) {
			maxIndex = i;
		}
	}

	if (maxIndex === 0) lcsPoints.push([traj1[0], traj2[0]]);

	return score[maxIndex];
}

const LEFT_UP = 1;
const UP = 2;
const LEFT = 3;
function maxSimT(traj1, traj2, LCSSimArray = [], delta) {
	let maxSim = -Number.MAX_VALUE;
	for (let i = 0; i < traj1.length; i++) {
		for (let j = 0; j < traj2.length; j++) {
			if(LCSSimArray[i] == undefined) LCSSimArray[i] = [];
			LCSSimArray[i][j] = simPoints(traj1[i], traj2[j], delta);
			if(maxSim < LCSSimArray[i][j]) maxSim = LCSSimArray[i][j];
		}
	}
	return maxSim;
}
function LCS(traj1, traj2, LCSSimArray) {
	// 
	const LCSLengthArray = [];
	const LCSDirectArray = [];

	// init 
	for (var i = 0; i < traj1.length; i++) {
		LCSLengthArray[i] = [];
		LCSDirectArray[i] = [];
	}

	for (let i = 0; i < traj1.length; i++) {
		for (let j = 0; j < traj2.length; j++) {

			const simp = LCSSimArray[i][j];

			if (i == 0 || j == 0) {
				if ( i > 0) {
					LCSLengthArray[i][j] = LCSLengthArray[i-1][j] + simp;
					LCSDirectArray[i][j] = LEFT;
				}
				else if ( j > 0) {
					LCSLengthArray[i][j] = LCSLengthArray[i][j-1] + simp;
					LCSDirectArray[i][j] = UP;
				} else {
					LCSLengthArray[i][j] = simp;
					LCSDirectArray[i][j] = LEFT_UP;
				}

			} else {
				if (simp > 0) {

					LCSLengthArray[i][j] = LCSLengthArray[i-1][j-1] + simp;
					LCSDirectArray[i][j] = LEFT_UP;

				} else if (LCSLengthArray[i][j-1] > LCSLengthArray[i-1][j]) {

					LCSLengthArray[i][j] = LCSLengthArray[i][j-1];
					LCSDirectArray[i][j] = UP;

				} else {

					LCSLengthArray[i][j] = LCSLengthArray[i-1][j];
					LCSDirectArray[i][j] = LEFT;

				}
			}
		}
	}
	const lcsPoints = [];
	getLCSPoints(lcsPoints,LCSDirectArray, traj1, traj2, traj1.length - 1, traj2.length - 1);
	return lcsPoints;
}

function getLCSPoints(lcsPoints, LCSDirectArray, traj1, traj2, row, col) {
	if (traj1.length === 0 || traj2.length === 0 ) 
		return [];
	if(LCSDirectArray[row][col] == LEFT_UP)  
    {  
        if(row > 0 && col > 0)  
            getLCSPoints(lcsPoints, LCSDirectArray, traj1, traj2, row - 1, col - 1);  
  
        // print the char  
        lcsPoints.push(traj1[row],traj2[col]);  
    }  
    else if(LCSDirectArray[row][col] == LEFT)  
    {  
        // move to the left entry in the direction matrix  
        if(col > 0)  
            getLCSPoints(lcsPoints, LCSDirectArray, traj1, traj2, row, col - 1);  
    }  
    else if(LCSDirectArray[row][col] == UP)  
    {  
        // move to the up entry in the direction matrix  
        if(row > 0)  
            getLCSPoints(lcsPoints, LCSDirectArray, traj1, traj2, row - 1, col);  
    }  
}