import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const cellPhoneSchema = new Schema({
	Date: Number,
	IMEI: String,
	geom: String
},{
	collection:'cellPhoneTrack'
});

export default mongoose.model('cellPhoneTrack', cellPhoneSchema);
