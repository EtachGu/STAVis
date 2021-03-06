import  express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import  path from 'path';
import  logger from './logger';

// Webpack Requirements
import  webpack from 'webpack';
import  config from '../webpack.dev.config';
import  webpackDevMiddleware from 'webpack-dev-middleware';
import  webpackHotMiddleware from 'webpack-hot-middleware';

// Initialize the Express App
const app = express();

// Run Webpack dev server in development mode
if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(config);
  const middleware = webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath, silent: true, stats: 'errors-only' });
  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  const fs = middleware.fileSystem;

  app.get('/', (req, res) => {
    fs.readFile(path.join(compiler.outputPath, 'index.html'), (err, file) => {
      if (err) {
        res.sendStatus(404);
      } else {
        res.send(file.toString());
      }
    });
  });

}

// // RESTful API
import routers from './routes/routes';
import  serverConfig from './config';

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
app.use('/api', routers);

// start app
app.listen(serverConfig.port, (error) => {
  if (!error) {
    console.log(`MERN is running on port: ${serverConfig.port}! Build something amazing!`); // eslint-disable-line
  }
  logger.appStarted(serverConfig.port);
});

export default app;
