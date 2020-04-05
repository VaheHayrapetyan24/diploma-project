const ApiController = require('./base/apiController');
const { stationsValidation } = require('../validation');

class StationsController extends ApiController {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.Stations;
    this.name = 'station';
    this.mainService = ctx.service.stationsService;
  }
  async create() {
    this.validate(stationsValidation.create);
    const { request: { body } } = this.ctx;
    const station = await this.mainService.create(body);
    this.success(station);
  }
}

module.exports = StationsController;
