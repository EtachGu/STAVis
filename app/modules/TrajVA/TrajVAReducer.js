import { ADD_TRACKDATA,ADD_STATISTICS,UPDATE_TASKS, UPDATE_CONTROLS } from './TrajVAActions';


// Initial State
const initialState = {
	trajectories: {},
	statistics:{},
	controls:{
	  	trajName:'cellPhoneTrack',
	  	datetime:["2016-03-02","2016-03-03"]
  	},
	tasks:{
		steps:[{name:'概览',status:'finish'},{name:'分析',status:'process'},{name:'结论',status:'wait'},{name:'完成',status:'wait'}]
	}
};

const PostReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TRACKDATA :
      return Object.assign(
        {},
        state,
        {
			trajectories: action.data,
        }
      );
	  case ADD_STATISTICS:
		  return Object.assign( {}, state,
			  {
				  statistics: action.data,
			  }
		  );
	  case UPDATE_TASKS:
		  return Object.assign({}, state, {tasks:action.data});
	  case UPDATE_CONTROLS;
	  	  return Object.assign({}, state, {controls:action.data});
    default:
      return state;
  }
};

/* Selectors */

// Get all posts
export const getTrajVA = state => state.trajva;

// Get all posts
export const getTaxiOD = state => state.trajva.taxiOD;

// Export Reducer
export default PostReducer;
