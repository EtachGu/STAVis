/**
 * Root Reducer
 */
import { combineReducers } from 'redux';

// Import Reducers
import trajva from './modules/TrajVA/TrajVAReducer';

// Combine all reducers into one root reducer
export default combineReducers({
  trajva,
});

