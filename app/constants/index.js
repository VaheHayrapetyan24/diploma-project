exports.USER_ROLES = Object.freeze({
  SUPER_ADMIN: 'SA',
  ADMIN: 'A',
  USER: 'U',
});

exports.BUS_TYPES = Object.freeze({
  MICROBUS: 'microbus',
  TROLLY: 'trolly',
  BUS: 'bus',
});

exports.EIGHT_CHAR_NUMBER_SPECIAL_CHAR_REGEX = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$');
