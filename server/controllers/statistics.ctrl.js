/**
 * Created by lenovo on 2017/3/19.
 */
import * as MetroTrack from './trajectories/metroTrack.controller';
 // 	   collectName: _taxi_,
 //        type: _count_,
 //        datetime: "2016-03-02",
 //        timeunit: _timeunit_,
 //        fields: [_field1_,_field2_]

export function getStatisticByConditions(req, res) {
	if (!req.body) {
		res.status(403).end();
	}
	if (req.is('text/*')){
		req.body = JSON.parse(req.body);
	}
	const collectName = req.body.collectName;
	switch(collectName) {
		case 'taxiOD':
			break;
		case 'cellPhoneTrack':
			break;
		case 'publicTransit':break;
		case 'statisticMetroTrack':
			postMetroTrack(req,res); break;
		default:
	}
}

function postMetroTrack(req, res) {

	const type  = req.body.type;

	const datetime = req.body.datetime;
	const startDate = datetime[0];
	const endDate = datetime[1];

	const timeunit = req.body.timeunit;

	const fields = req.body.fields;   //  clusterid

	MetroTrack.getMetroCount(type, startDate,endDate,timeunit,fields,(data) => {
		if(data.err){
			res.status(500).send(data.err);
		} else {
			res.set({
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'Content-Type',
				'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
			});
			res.json({
				datetime,
				timeunit,
				data
			});
		}
	});
}