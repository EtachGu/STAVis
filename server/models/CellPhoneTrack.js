import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const cellPhoneSchema = new Schema({
	taxinumber:Number,
	contorl:String,
	alarm:Number,
	isempty:Number,
	lightstatu:Schema.Types.Mixed,
	overpass:Number,
	brake:Number,
	reservefield:Schema.Types.Mixed,
	receivetime:String,
	gpstime:String,
	longitude:Number,
	latitude:Number,
	speed:Number,
	direction:Number,
	satellitenumber:Number,
	reservefield2:String,
	contorl2:String,
	alarm2:Number,
	isempty2:Number,
	lightstatu2:Schema.Types.Mixed,
	overpass2:Number,
	brake2:Number,
	reservefield21:Schema.Types.Mixed,
	receivetime2:String,
	gpstime2:String,
	longitude2:Number,
	latitude2:Number,
	speed2:Number,
	direction2:Number,
	satellitenumber2:Number,
	reservefield22:String
},{
	collection:'cellPhoneTrack'
});

export default mongoose.model('cellPhoneTrack', cellPhoneSchema);
