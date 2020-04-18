const create = {
  stationIds: {
    type: 'array',
    required: true,
    itemType: 'mongodbId',
  },
};

const update = {
  stationIds: {
    type: 'array',
    required: true,
    itemType: 'mongodbId',
  },
};

module.exports = {
  create,
  update,
};
