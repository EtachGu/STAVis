/**
 * Created by lenovo on 2017/3/23.
 */
import { createSelector } from 'reselect';
const selectDefault = (state) => state.trajva;
const selectStatistics = createSelector(
	selectDefault,
	(globalState) => globalState.statistics
);
export {
	selectStatistics,
};
