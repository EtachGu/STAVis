import callApi from '../../util/apiCaller';

// Export Constants
export const ADD_TAXIOD = 'ADD_TAXIOD';

// Export Actions
export function addTaxiOD(data) {
  return {
    type: ADD_TAXIOD,
    data,
  };
}


// Call API
export function addTaxiODRequest(post) {
  return (dispatch) => {
    return callApi('taxiOD', 'post', {
      post: {
        content: post.content,
      },
    }).then(res => dispatch(addTaxiOD(res.post)));
  };
}

// Request the Data
export function fetchTaxiODs() {
  return (dispatch) => {
    return callApi('taxiOD').then(res => {
      dispatch(addTaxiOD(res.posts));
    });
  };
}

// datetime  2016-03-01 00:00:00
export function fetchTaxiOD(datetime) {
  return (dispatch) => {
    return callApi(`taxiOD/${datetime}`).then(res => dispatch(addTaxiOD(res.post)));
  };
}
