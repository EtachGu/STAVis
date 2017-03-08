import 'babel-polyfill';
import  express from 'express';
import  mongoose from 'mongoose';
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
import  taxiOD from './routes/taxiOD.routes';
import  serverConfig from './config';

// Set native promises as mongoose promise
mongoose.Promise = global.Promise;

// MongoDB Connection
mongoose.connect(serverConfig.mongoURL, (error) => {
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
app.use('/api', taxiOD);

// start app
app.listen(serverConfig.port, (error) => {
  if (!error) {
    console.log(`MERN is running on port: ${serverConfig.port}! Build something amazing!`); // eslint-disable-line
  }
  logger.appStarted(serverConfig.port);
});

export default app;
