
const express = require('express');
const logger = require('./logger');

const config = require('./config');
const setup = require('./middlewares/frontendMiddleware');
const resolve = require('path').resolve;
const app = express();

setup(app, {
	outputPath: resolve(process.cwd(), 'build'),
	publicPath: '/',
});

const port = config.port;

app.listen(port, (err) => {
	if (err) {
		return logger.error(err.message);
	}

	logger.appStarted(port);
});