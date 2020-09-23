/* eslint valid-jsdoc: "off" */

"use strict";

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1599028261873_5996";

  // add your middleware config here
  config.middleware = [];

  config.multipart = {
    mode: "file",
    whitelist: () => true,
  };
  // add your user config here
  const userConfig = {
    jwt: {
      secret: "adgs0923qt234t",
    },
  };

  return {
    ...config,
    ...userConfig,
    security: {
      csrf: {
        enable: false,
      },
    },
    mongoose: {
      client: {
        url: "mongodb://127.0.0.1:27017/stackhub",
        options: {},
      },
    },
  };
};
