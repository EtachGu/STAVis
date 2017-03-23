/**
 * Created by lenovo on 2017/3/23.
 */

import { createSelector } from 'reselect';

const selectDefault = (state) => state.trajva;
const selectTasks = createSelector(
	selectDefault,
	(globalState) => globalState.tasks
);
const selectSteps = createSelector(
	selectDefault,
	(globalState) => globalState.tasks.steps
);
export {
	selectTasks,
	selectSteps
};
