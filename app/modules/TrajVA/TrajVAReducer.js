import { ADD_TRACKDATA,ADD_STATISTICS,UPDATE_TASKS, UPDATE_CONTROLS, ADD_CLUSTERTRACKS } from './TrajVAActions';


// Initial State
const initialState = {
	trajectories: {},
	statistics:{},
	controls:{
		trajName:'cellPhoneTrack',
		datetime:["2016-03-02","2016-03-03"],
		timeunit: "1dd",
		id: [2,3,4],
		isClstSettingOpen: false, // Cluster 开关
		clstPointMin: 10,   //  cluster 点集 的 核心数
		clstPointDis: 3000,  //  cluster 点集 的 核心距离
		clstTrjMin: 10, 	// LCS-DBSCAN 线集合 核心数
		clstTrjDis: 2000,   // LCS-DBSCAN 线集合  线段之间距离
		clstTrjNearNum: 20,    // LCS-DBSCAN 线集合 邻近数
		clstTrjMinLength: 1000,  //  LCS-DBSCAN 线集合 最短的长度
		mapType: 1,
		geomType: 2,      // 1 = points,  2 = line  3 = heatmap
		map3d: false,     // 3d map

		// ParamSetting
		isTimeViewVisible: true, // TimeView visiblity
		isGraphViewVisible: true, // GraphView visiblity

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
		case ADD_CLUSTERTRACKS:
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
		case UPDATE_CONTROLS:
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
