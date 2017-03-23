import { ADD_TRACKDATA,ADD_STATISTICS } from './TrajVAActions';


// Initial State
const initialState = {
	trajectories: {},
	statistics:{},
	controls:{
	  	trajName:'cellPhoneTrack',
	  	datetime:["2016-03-02","2016-03-03"]
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
