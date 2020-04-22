const BaseController = require('./base/baseController');

class SeatsController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.mainService = ctx.service.seatsService;
    this.model = ctx.model.Seats;
    this.name = 'seat';
  }

  async findFreeSeats() {
    // todo validate for seatfrom, seatto
    const { body } = this.ctx.request;
    const { tripId, stationFrom, stationTo } = body;
    const freeSeats = await this.mainService.findFreeSeats(tripId, stationFrom, stationTo);
    this.success(freeSeats);
  }
}

module.exports = SeatsController;
