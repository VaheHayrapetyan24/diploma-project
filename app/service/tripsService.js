const BaseService = require('./base/baseService');
const HttpError = require('../errors/httpError');

class TripsService extends BaseService {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.Trips;
    this.name = 'trip';
  }

  async findByIdWithPopulatedIds(tripId) {
    const trip = await this.model
      .findById(tripId)
      .populate('busId')
      .populate('routeId');
    if (!trip) {
      throw new HttpError(404, `Record with ${tripId} in collection ${this.name} not found`);
    }
    return trip;
  }
}

module.exports = TripsService;
