const BaseController = require('./base/baseController');

class SeatsController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.mainService = ctx.service.seatsService;
    this.model = ctx.model.Seats;
    this.name = 'seat';
  }

  async findFreeSeats() { // todo move this to trips controller
    // todo validate for seatfrom, seatto
    const { query } = this.ctx.request;
    const { tripId, stationFrom, stationTo } = query;
    const freeSeats = await this.mainService.findFreeSeats(tripId, stationFrom, stationTo);
    this.success(freeSeats);
  }
}

module.exports = SeatsController;
