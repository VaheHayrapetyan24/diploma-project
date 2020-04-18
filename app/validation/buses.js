const { BUS_TYPES } = require('../constants');

const create = {
  type: {
    type: 'enum',
    values: Object.values(BUS_TYPES),
    required: true,
  },
};

const update = {
  type: {
    type: 'enum',
    values: Object.values(BUS_TYPES),
    required: false,
  },
};

module.exports = {
  create,
  update,
};
