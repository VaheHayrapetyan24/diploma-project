const ApiController = require('./base/apiController');
const { routesValidation } = require('../validation');

class RoutesController extends ApiController {
  constructor(ctx) {
    super(ctx);
    this.mainService = ctx.service.routesService;
    this.model = ctx.model.Routes;
    this.name = 'route';
  }

  async create() {
    this.validate(routesValidation.create);
    const { stationIds } = this.ctx.request.body;
    const { stationsService } = this.ctx.service;
    const uniqueStationIds = await stationsService.checkIfStationsExistAndThrow(stationIds);
    const route = await this.mainService.create({ stationIds: uniqueStationIds });
    this.success(route);
  }

  async update() {
    this.validate(routesValidation.update);
    const {
      request: { body: { stationIds } },
      params: { id },
    } = this.ctx;
    const { stationsService } = this.ctx.service;
    const uniqueStationIds = await stationsService.checkIfStationsExistAndThrow(stationIds);
    await this.mainService.findByIdOrThrow(id);
    const route = await this.mainService.updateById(id, { stationIds: uniqueStationIds });
    this.success(route);
  }
}

module.exports = RoutesController;
