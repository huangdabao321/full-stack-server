'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    console.log(123);
    ctx.body = 'hi, egg';
  }
}

module.exports = HomeController;
