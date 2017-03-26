import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const cellPhoneSchema = new Schema({
	Date: Number,
	IMEI: String,
	clusterid: Number,
	geom: String
},{
	collection:'cellPhoneTrack'
});

export default mongoose.model('cellPhoneTrack', cellPhoneSchema);
