const ApiController = require('./base/apiController');
const { stationsValidation } = require('../validation');

class StationsController extends ApiController {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.Stations;
    this.name = 'station';
    this.mainService = ctx.service.stationsService;
    this.bodyValidation = stationsValidation;
  }
}

module.exports = StationsController;
