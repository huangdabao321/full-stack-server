const jwt = require("jsonwebtoken");

module.exports = ({ app }) => {
  return async function verify(ctx, next) {
    if (!ctx.request.header.authorization) {
      ctx.body = {
        code: 401,
        message: "用户未登录",
      };
      return;
    }
    try {
      const token = ctx.request.header.authorization.replace("Bearer ", "");
      const ret = await jwt.verify(token, app.config.jwt.secret);
      ctx.state.userid = ret._id
      ctx.state.email = ret.email
      await next()
    } catch (error) {
      ctx.body = {
        code: 401,
        message: error.message,
      };
      return 
    }
  };
};
