import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const cellPhoneSchema = new Schema({
	IMEI: String,
	longitude1: Number,
	latitude1: Number,
	longitude2: Number,
	latitude2: Number,
	longitude3: Number,
	latitude3: Number,
	longitude4: Number,
	latitude4: Number,
	longitude5: Number,
	latitude5: Number,
	longitude6: Number,
	latitude6: Number,
	longitude7: Number,
	latitude7: Number,
	longitude8: Number,
	latitude8: Number,
	longitude9: Number,
	latitude9: Number,
	longitude10: Number,
	latitude10: Number,
	longitude11: Number,
	latitude11: Number,
	longitude12: Number,
	latitude12: Number,
	longitude13: Number,
	latitude13: Number,
	longitude14: Number,
	latitude14: Number,
	longitude15: Number,
	latitude15: Number,
	longitude16: Number,
	latitude16: Number,
	longitude17: Number,
	latitude17: Number,
	longitude18: Number,
	latitude18: Number,
	longitude19: Number,
	latitude19: Number,
	longitude20: Number,
	latitude20: Number,
	longitude21: Number,
	latitude21: Number,
	longitude22: Number,
	latitude22: Number,
	longitude23: Number,
	latitude23: Number,
	longitude24: Number,
	latitude24: Number
},{
	collection:'cellPhoneTrack'
});

export default mongoose.model('cellPhoneTrack', cellPhoneSchema);