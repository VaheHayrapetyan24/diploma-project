const { omit } = require('lodash');
const BaseController = require('./base/baseController');
const { usersValidation } = require('../validation');

class UsersController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.Users;
    this.name = 'user';
    this.mainService = ctx.service.usersService;
  }

  async getUser() {
    const { user } = this.ctx.state;
    const transformedUser = this.removePasswordInfo(user);
    this.success(transformedUser);
  }

  async signup() {
    this.validate(usersValidation.signup);
    const { request: { body } } = this.ctx;
    const user = await this.mainService.signup(body);
    const transformedUser = this.removePasswordInfo(user);
    this.success(transformedUser);
  }

  async login() {
    this.validate(usersValidation.login);
    const { request: { body } } = this.ctx;
    const jwt = await this.mainService.login(body);
    this.success(jwt);
  }

  async changePassword() {
    this.validate(usersValidation.changePassword);
    const { request: { body } } = this.ctx;
    const { user } = this.ctx.state;
    await this.mainService.changeUserPassword(user, body.oldPassword, body.newPassword);
    this.success();
  }

  removePasswordInfo(user) {
    return omit(user.toObject(), [ 'password', 'passwordSalt' ]);
  }
}

module.exports = UsersController;
