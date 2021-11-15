const config = {
    passport: {
      secret: 'sampleappkey',
      expiresIn: 10000,
    },
    env: {
      port: 8080,
      mongoDBUri: 'mongodb://admin:0.0.0.0',
      mongoHostName: process.env.ENV === 'prod' ? 'mongodbAtlas' : 'localhost',
    },
    underscoreId : '_id'
  };

  module.exports = config