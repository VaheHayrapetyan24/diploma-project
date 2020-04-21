const ApiController = require('./base/apiController');
const moment = require('moment');
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
    body.dateTime = moment(body.dateTime, 'YYYY-MM-DD HH:MM:SS').toDate();
    const entity = await this.mainService.create(body);
    this.success(entity);
  }

  async update() {
    const { request: { body }, params: { id } } = this.ctx;
    this.validate(tripsValidation.update);
    await this.checkExistingIds(body.routeId, body.busId);
    body.dateTime = moment(body.dateTime, 'YYYY-MM-DD HH:MM:SS').toDate();
    const entity = await this.mainService.updateById(id, body);
    this.success(entity);
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
