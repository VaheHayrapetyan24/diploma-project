const ApiController = require('./base/apiController');
const { busesValidation } = require('../validation');

class BusesController extends ApiController {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.Buses;
    this.name = 'bus';
    this.mainService = ctx.service.busesService;
    this.bodyValidation = busesValidation;
  }

  async create() {
    const { type } = this.ctx.request.body;
    this.ctx.request.body.seatCount = this.mainService.getSeatCountByType(type);
    return super.create();
  }

  async update() {
    const { type } = this.ctx.request.body;
    if (type) {
      this.ctx.request.body.seatCount = this.mainService.getSeatCountByType(type);
    }
    return super.update();
  }
}

module.exports = BusesController;
