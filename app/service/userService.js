// const _ = require('lodash');
const BaseService = require('./base/baseService');
// const generatePassword = require('password-generator');
const bcrypt = require('bcryptjs');
const HttpError = require('../errors/httpError');

const FORBIDDEN_MESSAGE = 'Forbidden. Email or password is invalid';
const EMPTY_PASSWORD = 'Forbidden. Empty password not allowed';

class UserService extends BaseService {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.Users;
    this.name = 'user';
  }

  async signup({ email, name, password }) {
    await this.checkIfEmailAlreadyExists(email);
    const user = await this.create({ email, name });
    return this.savePassword(user, password);
  }

  async checkIfEmailAlreadyExists(email) {
    const existingUser = await this.findOne({ email });
    if (!existingUser) return;
    throw new HttpError(400, 'User with email already exists');
  }

  checkPassword(user, password) {
    if (!user.password) {
      throw new HttpError(403, EMPTY_PASSWORD);
    }
    if (!password) {
      throw new HttpError(422, EMPTY_PASSWORD);
    }
    const checked = bcrypt.compareSync(password, user.password);
    if (checked) {
      return;
    }

    throw new HttpError(403, FORBIDDEN_MESSAGE);
  }

  async login({ email, password }) {
    const user = await this.checkAndFindOne({ email });
    this.checkPassword(user, password);

    return this.getSignedJWT(user);
  }

  async changeUserPassword(user, oldPassword, newPassword) {
    this.checkPassword(user, oldPassword);
    await this.savePassword(user, newPassword);
  }

  getSignedJWT(user) {
    return this.app.jwt.sign({
      id: user._id,
      email: user.email,
      role: user.role,
    }, this.config.jwt.secret);
  }

  async savePassword(user, password) {
    if (!user.passwordSalt) {
      user.passwordSalt = bcrypt.genSaltSync(10);
    }
    user.password = bcrypt.hashSync(password, user.passwordSalt);
    return user.save();
  }
}

module.exports = UserService;
