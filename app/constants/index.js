exports.USER_ROLES = Object.freeze({
  SUPER_ADMIN: 'SA',
  ADMIN: 'A',
  USER: 'U',
});

exports.BUS_TYPES = Object.freeze({
  MICROBUS: 'MICROBUS',
  TROLLY: 'TROLLY',
  BUS: 'BUS',
});

exports.BUS_PASSENGER_COUNTS = Object.freeze({
  MICROBUS: 20,
  TROLLY: 40,
  BUS: 30,
});

exports.EIGHT_CHAR_NUMBER_SPECIAL_CHAR_REGEX = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$');
