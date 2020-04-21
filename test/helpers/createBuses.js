const { BUS_PASSENGER_COUNTS, BUS_TYPES } = require('../../app/constants');

module.exports = async function(app) {
  return app.model.Buses.insertMany([
    {
      type: BUS_TYPES.BUS,
      seatCount: BUS_PASSENGER_COUNTS.BUS,
    },
  ]);
};
