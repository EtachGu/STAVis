/**
 * Created by lenovo on 2017/3/26.
 */

import { createSelector } from 'reselect';

const selectDefault = (state) => state.trajva;
const selectTrajectory = createSelector(
	selectDefault,
	(globalState) => globalState.trajectories
);
const selectControls = createSelector(
	selectDefault,
	(globalState) => globalState.controls
);

export {
	selectTrajectory,
	selectControls
};
