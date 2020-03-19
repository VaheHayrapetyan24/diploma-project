const { Types } = require('mongoose');
const { EIGHT_CHAR_NUMBER_SPECIAL_CHAR_REGEX } = require('../constants');

const INVALID_MONGODB_ID_MESSAGE = 'Invalid mongoDb Id';
const PASSWORD_CHECK_FAIL_MESSAGE = 'Password should contain one upperCase, one number, one special character and be at least 8 char long';
module.exports = {
  mongodbId: (rule, value) => {
    let cast;
    try {
      value = value ? value.toString() : '';
      cast = new Types.ObjectId(value);
    } catch (err) {
      return INVALID_MONGODB_ID_MESSAGE;
    }
    if (cast.toString() !== value) {
      return INVALID_MONGODB_ID_MESSAGE;
    }
  },
  password: (rule, value) => {
    let check;
    try {
      check = EIGHT_CHAR_NUMBER_SPECIAL_CHAR_REGEX.test(value);
    } catch (err) {
      return PASSWORD_CHECK_FAIL_MESSAGE;
    }
    if (!check) {
      return PASSWORD_CHECK_FAIL_MESSAGE;
    }
  },
};
