const { omit } = require('lodash');
const BaseController = require('./base/baseController');
const { userValidation } = require('../validation');

class UserController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.Users;
    this.name = 'user';
    this.mainService = ctx.service.userService;
  }

  async getUser() {
    const { user } = this.ctx.state;
    const transformedUser = this.removePasswordInfo(user);
    this.success(transformedUser);
  }

  async signup() {
    this.validate(userValidation.signup);
    const { request: { body } } = this.ctx;
    const user = await this.mainService.signup(body);
    const transformedUser = this.removePasswordInfo(user);
    this.success(transformedUser);
  }

  async login() {
    this.validate(userValidation.login);
    const { request: { body } } = this.ctx;
    const jwt = await this.mainService.login(body);
    this.success(jwt);
  }

  async changePassword() {
    this.validate(userValidation.changePassword);
    const { request: { body } } = this.ctx;
    const { user } = this.ctx.state;
    await this.mainService.changeUserPassword(user, body.oldPassword, body.newPassword);
    this.success();
  }

  removePasswordInfo(user) {
    return omit(user.toObject(), [ 'password', 'passwordSalt' ]);
  }
}

module.exports = UserController;
