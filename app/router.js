"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  const jwtMiddleware = app.middleware.jwt({ app });
  router.get("/", controller.home.index);
  //验证码
  router.get("/captcha", controller.until.captcha);
  router.post("/upload", controller.until.upload);
  router.post("/mergefile", controller.until.mergefile);
  router.post("/checkFile", controller.until.checkfile);
  //路由组
  router.group({ name: "user::", prefix: "/user" }, (router) => {
    router.post("/register", controller.user.register);
    router.post("/login", controller.user.login);
    router.get("/verify", controller.user.verify);
    router.get("/info", jwtMiddleware, controller.user.info);
  });
};
