const BaseController = require('./base/baseController');
const { findFreeSeats, reserveSeat } = require('../validation/seats');

class SeatsController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.mainService = ctx.service.seatsService;
    this.model = ctx.model.Seats;
    this.name = 'seat';
  }

  async findFreeSeats() {
    const { query } = this.ctx.request;
    this.validate(findFreeSeats, query);
    const { tripId, stationFrom, stationTo } = query;
    const trip = await this.getPopulatedTrip(tripId);
    const freeSeats = await this.mainService.findFreeSeats(trip, stationFrom, stationTo);
    this.success(freeSeats);
  }

  async reserveSeat() {
    this.validate(reserveSeat);
    const { user } = this.ctx.state;
    const { body:
      { tripId, stationFrom, stationTo, seatNumber } } = this.ctx.request;
    const trip = await this.getPopulatedTrip(tripId);
    const seat = await this.mainService.reserveSeat(user, trip, stationFrom, stationTo, seatNumber);
    this.success(seat);
  }

  async getPopulatedTrip(tripId) {
    const { tripsService } = this.ctx.service;
    return tripsService.findByIdWithPopulatedIds(tripId);
  }
}

module.exports = SeatsController;
