/**
 * Created by evan gu on 2017/3/18.
 */
import { geoDistance } from 'd3-geo';
/**
 *
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
	const lcsPoints = [];
	scoreLCS(traj1, traj2, lcsPoints, delta);
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
		len += geoDistance(points[i-1], points[i]);
	}
	return len;
}


/**
 * 计算两个点之间的距离
 * compute the distance between two Points
 * @param point1
 * @param point2
 * @returns number
 *
 */
export function distance(point1, point2) {
	return geoDistance(point1,point2);
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
	const dist = distance(point1, point2);
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
	score[0] = scoreLCS(nextTraj1, nextTraj2) + simPoints(traj1[0], traj2[0], delta);
	score[1] = scoreLCS(nextTraj1, traj2);
	score[2] = scoreLCS(traj1, nextTraj2);

	let maxIndex = 0;
	for (let i = 1; i < 3; i++) {
		if (score[i] > score[maxIndex]) {
			maxIndex = i;
		}
	}

	if (maxIndex === 0) lcsPoints.push([traj1[0], traj2[0]]);

	return score[maxIndex];
}
