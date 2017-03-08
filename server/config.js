const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/trajectory',
  port: process.env.PORT || 3000,
};

module.exports = config;
