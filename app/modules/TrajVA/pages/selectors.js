/**
 * Created by lenovo on 2017/3/23.
 */

import { createSelector } from 'reselect';

const selectDefault = (state) => state.trajva;
const selectControl = createSelector(
	selectDefault,
	(globalState) => globalState.controls
);
export {
	selectControl,
};
