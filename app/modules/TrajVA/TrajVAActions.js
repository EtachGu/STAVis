import callApi from '../../util/apiCaller';

// Export Constants
export const ADD_TRACKDATA = 'ADD_TRACKDATA';

// Export Actions
export function addTrajectories(data) {
  return {
    type: ADD_TRACKDATA,
    data,
  };
}

// Call API
export function addTrajSetRequest(reqBody) {
  return (dispatch) => {
    return callApi('trajectory', 'post', {
      trajName: reqBody.trajName,
      datetime: reqBody.datetime,
      timeunit: reqBody.timeunit,
      id: reqBody.id
    }).then(data => {
		if(!data.err) {
			dispatch(addTrajectories(data.data));
		}
	});
  };
}

// Request the Data
export function fetchTaxiODs() {
  return (dispatch) => {
    return callApi('taxiOD').then(res => {
      dispatch(addTrajectories(res.posts));
    });
  };
}

// datetime  2016-03-01 00:00:00
export function fetchTaxiOD(datetime) {
  return (dispatch) => {
    return callApi(`taxiOD/${datetime}`).then(res => dispatch(addTrajectories(res.post)));
  };
}


/**
 *  Statistics
 */
export const ADD_STATISTICS = 'ADD_STATISTICS';

export function addStatistics(data) {
	return {
		type: ADD_STATISTICS,
		data,
	};
}
import statistic from 'data/cellTrackCluster10_avg.json';
// Call API
export function addStatisticRequest(reqBody) {
	return (dispatch) => {
		dispatch(addStatistics(statistic));
		// return callApi('statistics', 'post', reqBody).then(res => dispatch(addTrajectories(res.body)));
	};
}

/**
 *  Task Action
 */
export const UPDATE_TASKS = 'UPDATE_TASKS';

export function updateTasks(data) {
	return {
		type: UPDATE_TASKS,
		data,
	};
}

/**
 *  Control
 */
 export const UPDATE_CONTROLS = 'UPDATE_CONTROLS';

 export function updateControls(data) {
  return {
    type: UPDATE_CONTROLS,
    data,
  };
 }