import { ADD_TAXIOD } from './TrajVAActions';

// Initial State
const initialState = {
  taxiOD: {},
};

const PostReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TAXIOD :
      return Object.assign(
        {},
        state,
        {
          taxiOD: action.data,
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
