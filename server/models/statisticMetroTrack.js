import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const statisticMetroTrack = new Schema({
	icstation: String,
	hours: Number,
	count: Number,
	geom: String,
	icdate: String
},{
	collection:'statisticMetroTrack'
});

export default mongoose.model('statisticMetroTrack', statisticMetroTrack);
