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

const selectControlsGeomType = createSelector(
	selectDefault,
	(globalState) => globalState.controls.geomType
);

const selectControlsMapType = createSelector(
	selectDefault,
	(globalState) => globalState.controls.mapType
);

const selectControlsMap3d = createSelector(
	selectDefault,
	(globalState) => globalState.controls.map3d
)

export {
	selectTrajectory,
	selectControls,
	selectControlsGeomType,
	selectControlsMapType,
	selectControlsMap3d
};
