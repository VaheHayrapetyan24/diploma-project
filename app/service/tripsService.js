const BaseService = require('./base/baseService');

class TripsService extends BaseService {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.Trips;
    this.name = 'trip';
  }
}

module.exports = TripsService;
