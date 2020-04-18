const BaseService = require('./base/baseService');
const { BUS_PASSENGER_COUNTS } = require('../constants');

class BusesService extends BaseService {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.Buses;
    this.name = 'bus';
  }

  getSeatCountByType(type) {
    return BUS_PASSENGER_COUNTS[type];
  }
}

module.exports = BusesService;
