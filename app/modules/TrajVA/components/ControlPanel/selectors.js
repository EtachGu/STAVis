/**
 * Created by lenovo on 2017/3/28.
 */

import { createSelector } from 'reselect';

const selectDefault = (state) => state.trajva;
const selectControls = createSelector(
	selectDefault,
	(globalState) => globalState.controls
);

export {
	selectControls,
};
