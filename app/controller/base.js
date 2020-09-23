"use strict";

const Controller = require("egg").Controller;

class BaseController extends Controller {
  success(data) {
    this.ctx.body = {
      code: 0,
      data,
    };
  }

  error(message, code = -1, errors = {}) {
    this.ctx.body = {
      code,
      message,
      errors,
    };
  }

  message(message) {
    this.ctx.body = {
      code: 0,
      message,
    };
  }
}

module.exports = BaseController;
