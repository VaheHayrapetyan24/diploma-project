module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1575433769454_6382';

  config.jwt = {
    secret: 'afeehrglrta2f9re56g21re45g6d5s3eg4ser56g2awfergser51hsr2tsdsrg5dfz64hgerf48565grhg',
  };

  config.middleware = [ 'authorize' ];

  config.authorize = {
    ignore: [ '/users/signup', '/users/login' ],
  };

  config.mongoose = {
    client: {
      url: 'mongodb://localhost:27017/busservice',
      options: {},
      migrationUrl: 'mongodb://localhost:27017/busservice',
    },
  };

  config.bodyParser = {
    enable: true,
    encoding: 'utf8',
    jsonLimit: '300kb',
    strict: true,
    queryString: {
      arrayLimit: 100,
      depth: 5,
      parameterLimit: 1000,
    },
  };

  config.security = {
    domainWhiteList: [ 'localhost:3000' ],
    csrf: {
      enable: false,
    },
  };

  config.onerror = {
    all(err, ctx) {
      if (err.type === 'http') {
        ctx.status = err.status;
      }

      const error = {
        message: err.message,
      };

      if (err.code === 'invalid_param') {
        error.errors = err.errors;
      }

      ctx.body = JSON.stringify(error);
    },
  };

  exports.logger = {
    consoleLevel: 'DEBUG',
    disableConsoleAfterReady: false,
  };

  return config;
};
