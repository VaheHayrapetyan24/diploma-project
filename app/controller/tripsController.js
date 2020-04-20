const ApiController = require('./base/apiController');
const { tripsValidation } = require('../validation');

class TripsController extends ApiController {
  constructor(ctx) {
    super(ctx);
    this.mainService = ctx.service.tripsService;
    this.model = ctx.model.Trips;
    this.name = 'trip';
    this.bodyValidation = tripsValidation;
  }

  async create() {
    const { request: { body } } = this.ctx;
    this.validate(tripsValidation.create);
    await this.checkExistingIds(body.routeId, body.busId);
    return super.create();
  }

  async update() {
    const { request: { body } } = this.ctx;
    this.validate(tripsValidation.update);
    await this.checkExistingIds(body.routeId, body.busId);
    return super.update();
  }

  async checkExistingIds(routeId, busId) {
    const { routesService, busesService } = this.service;
    return Promise.all([
      routeId && routesService.findByIdOrThrow(routeId),
      busId && busesService.findByIdOrThrow(busId),
    ]);
  }
}

module.exports = TripsController;
