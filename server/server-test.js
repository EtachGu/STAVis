/**
 * Created by lenovo on 2017/3/20.
 */
import  express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import  logger from './logger';

// // RESTful API
import routers from './routes/routes';
import  serverConfig from './config';

// Initialize the Express App
const app = express();

// Set native promises as mongoose promise
mongoose.Promise = global.Promise;

// MongoDB Connection
const connectOption = {
	server: {
		socketOptions: {
			connectTimeoutMS:30000,
			socketTimeoutMS:30000,
			keepAlive: 1
		}
	}
};
mongoose.connect(serverConfig.mongoURL, connectOption, (error) => {
	if (error) {
		console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
		throw error;
	}
	console.log(serverConfig.mongoURL);
	console.log(process.env.MONGO_URL);
	// feed some dummy data in DB.
	// dummyData();
});

// Apply body Parser and server public assets and routes
app.use(bodyParser.json({ limit: '20mb' }));// for parsing application/json
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));// for parsing application/x-www-form-urlencoded
app.use(bodyParser.text());
app.use('/api', routers);

// start app
app.listen(serverConfig.port, (error) => {
	if (!error) {
		console.log(`STAVis is running on port: ${serverConfig.port}! Build something amazing!`); // eslint-disable-line
	}
	logger.appStarted(serverConfig.port);
});

export default app;
