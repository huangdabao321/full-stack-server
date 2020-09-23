const jwt = require("jsonwebtoken");
const BaseController = require("./base");
const md5 = require("md5");
const registerRules = {
  email: { type: "email", required: true },
  nickname: { type: "string", required: true },
  pwd: { type: "string", required: true, min: 6, max: 12 },
};
const SALT = "$#*&$(*$ASDG446";
class UserController extends BaseController {
  async register() {
    const { ctx } = this;
    try {
      ctx.validate(registerRules, ctx.request.body);
    } catch (error) {
      return this.error("验证失败", -1, unValid.errors);
    }

    const { email, nickname, pwd, captcha } = ctx.request.body;
    if (captcha.toUpperCase() === ctx.session.captcha.toUpperCase()) {
      if (await this.checkEmail(email)) {
        return this.error("邮箱已占用");
      }
      let ret = await ctx.model.User.create({
        email,
        nickname,
        pwd: md5(pwd + SALT),
      });
      if (ret._id) {
        return this.message("注册成功");
      }
    } else {
      return this.error("验证码错误");
    }
    //return this.success({ hello: "xxx" });
  }
  async login() {
    const { ctx,app } = this;
    const { email, pwd, captcha } = ctx.request.body;
    if (ctx.session.captcha.toUpperCase() !== captcha.toUpperCase()) {
      return this.error("验证码错误");
    }
    const user = await this.checkEmail(email);
    if (!user) {
      return this.error("用户不存在");
    }

    if (md5(pwd + SALT) !== user.pwd) {
      return this.error("密码错误");
    }

    const token = jwt.sign(
      {
        _id: user._id,
        email: email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      app.config.jwt.secret
    );
    return this.success({ token: token });
  }

  async info() {
    const { ctx } = this;
    const { userid,email } = ctx.state;
    const user = await this.checkEmail(email)
    return this.success(user)
  }

  async verify() {}

  async checkEmail(email) {
    const user = await this.ctx.model.User.findOne({ email });
    return user;
  }
}

module.exports = UserController;
